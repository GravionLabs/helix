import type { z } from 'zod';
import type { HelixFieldDescriptor } from '../model/helix-field-descriptor';
import {
  type HelixFieldMeta,
  type HelixSelectOption,
  type HelixWidgetKind,
  readHelixMeta,
} from '../model/helix-field-meta';

// Declared by Angular's build toolchain — true in development, false in production.
declare const ngDevMode: boolean | undefined;

const WRAPPER_TYPES = new Set(['optional', 'nullable', 'default', 'readonly', 'nonoptional']);

/** Native `<input type>` per input-based widget kind. */
const INPUT_TYPES: Record<string, string> = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
  date: 'date',
};

interface Unwrapped {
  inner: z.ZodType;
  required: boolean;
}

type AnyZod = z.ZodType & {
  _zod: { def: Record<string, unknown> & { type: string } };
};

function defOf(schema: z.ZodType): Record<string, unknown> & { type: string } {
  return (schema as AnyZod)._zod.def;
}

/** Peels optional/nullable/default/readonly wrappers, tracking requiredness. */
function unwrap(schema: z.ZodType): Unwrapped {
  let inner = schema;
  let required = true;
  while (WRAPPER_TYPES.has(defOf(inner).type)) {
    const type = defOf(inner).type;
    if (type === 'optional' || type === 'nullable' || type === 'default') required = false;
    if (type === 'nonoptional') required = true;
    inner = (inner as unknown as { unwrap(): z.ZodType }).unwrap();
  }
  return { inner, required };
}

function normalizeOptions(
  options: HelixFieldMeta['options'],
): readonly HelixSelectOption[] | undefined {
  if (!options) return undefined;
  return options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : (o as HelixSelectOption),
  );
}

function inferWidget(inner: z.ZodType): HelixWidgetKind | null {
  const def = defOf(inner);
  switch (def.type) {
    case 'string':
      return def['format'] === 'email' ? 'email' : 'text';
    case 'number':
    case 'int':
      return 'number';
    case 'boolean':
      return 'checkbox';
    case 'date':
      return 'date';
    case 'enum':
    case 'literal':
      return 'select';
    case 'array':
      return 'array';
    case 'object':
      return 'object';
    case 'union':
      return def['discriminator'] !== undefined ? 'union' : null;
    default:
      return null;
  }
}

function enumOptions(inner: z.ZodType): readonly HelixSelectOption[] | undefined {
  const def = defOf(inner);
  if (def.type === 'enum') {
    const values = (inner as unknown as { options: readonly (string | number)[] }).options;
    return values.map((v) => ({ label: String(v), value: v }));
  }
  if (def.type === 'literal') {
    const values = def['values'] as readonly (string | number | boolean)[];
    return values.map((v) => ({ label: String(v), value: v }));
  }
  return undefined;
}

/** Reads the discriminator literal of a union variant's tag field. */
function discriminatorValue(variant: z.ZodType, discriminator: string): string | number | boolean {
  const shape = (variant as unknown as { shape: Record<string, z.ZodType> }).shape;
  const tagDef = defOf(unwrap(shape[discriminator]).inner);
  const values = tagDef['values'] as readonly (string | number | boolean)[] | undefined;
  if (!values?.length) {
    throw new Error(
      `[zodToFieldDescriptors] Discriminated union variant has no literal value for ` +
        `discriminator "${discriminator}".`,
    );
  }
  return values[0];
}

function walk(schema: z.ZodType, key: string, path: readonly string[]): HelixFieldDescriptor {
  const meta = readHelixMeta(schema);
  const { inner, required } = unwrap(schema);
  const def = defOf(inner);
  const inferred = inferWidget(inner);
  const widget = meta.widget ?? inferred;

  if (widget === null || widget === undefined) {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      throw new Error(
        `[zodToFieldDescriptors] Zod type "${def.type}" at path "${path.join('.')}" has no ` +
          `automatic widget mapping. Set { widget: '...' } via helixMeta() to render it with a ` +
          `registered (custom) widget.`,
      );
    }
    // Production: render nothing rather than crash — fall through as plain text.
    return {
      key,
      path,
      widget: 'text',
      meta,
      zodType: inner,
      zodSource: schema,
      required,
      inputType: 'text',
    };
  }

  const descriptor: HelixFieldDescriptor = {
    key,
    path,
    widget,
    meta,
    zodType: inner,
    zodSource: schema,
    required,
    inputType: INPUT_TYPES[widget],
    options: normalizeOptions(meta.options) ?? enumOptions(inner),
  };

  if (def.type === 'object') {
    const shape = (inner as unknown as { shape: Record<string, z.ZodType> }).shape;
    const children = Object.entries(shape).map(([childKey, childSchema], index) => ({
      index,
      descriptor: walk(childSchema, childKey, [...path, childKey]),
    }));
    children.sort(
      (a, b) =>
        (a.descriptor.meta.order ?? Number.MAX_SAFE_INTEGER) -
          (b.descriptor.meta.order ?? Number.MAX_SAFE_INTEGER) || a.index - b.index,
    );
    descriptor.children = children.map((c) => c.descriptor);
  }

  if (def.type === 'array') {
    descriptor.itemDescriptor = walk(def['element'] as z.ZodType, '', path);
  }

  if (widget === 'union' && def.type === 'union') {
    const discriminator = def['discriminator'] as string;
    const variants = new Map<string | number | boolean, HelixFieldDescriptor>();
    for (const variant of (inner as unknown as { options: readonly z.ZodType[] }).options) {
      variants.set(discriminatorValue(variant, discriminator), walk(variant, key, path));
    }
    descriptor.union = { discriminator, variants };
  }

  return descriptor;
}

/**
 * Walks an annotated `z.object()` schema and produces the recursive
 * {@link HelixFieldDescriptor} tree consumed by the dynamic form renderer.
 *
 * Widget inference: string→text (`z.email()`→email), number→number,
 * boolean→checkbox, date→date, enum/literal→select, array→array,
 * object→object, discriminated union→union. Anything else requires a
 * `widget` override in {@link HelixFieldMeta} (throws in dev mode otherwise).
 */
export function zodToFieldDescriptors(schema: z.ZodObject): HelixFieldDescriptor {
  return walk(schema as unknown as z.ZodType, '', []);
}
