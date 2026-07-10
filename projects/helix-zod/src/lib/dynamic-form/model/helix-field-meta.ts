import type { SchemaPath } from '@angular/forms/signals';
import { z } from 'zod';

/**
 * Built-in widget kinds plus any custom key registered via
 * `provideHelixDynamicForms({ widgets })`.
 */
export type HelixWidgetKind =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'object'
  | 'array'
  | 'union'
  // biome-ignore lint/complexity/noBannedTypes: `string & {}` keeps literal autocomplete while allowing custom keys
  | (string & {});

export interface HelixSelectOption {
  label: string;
  value: unknown;
}

/**
 * UI metadata attached to a Zod field schema. Drives labels, widget selection,
 * ordering and the conditional engine of the dynamic form renderer.
 *
 * Attach it with {@link helixMeta} (preferred — keeps the same schema instance)
 * or via `schema.meta({ title, description, helix: { ... } })`.
 *
 * @template TRoot The root form model type the conditional predicates receive.
 */
export interface HelixFieldMeta<TRoot = Record<string, unknown>> {
  label?: string;
  placeholder?: string;
  hint?: string;
  /** Overrides the widget inferred from the Zod type. */
  widget?: HelixWidgetKind;
  /** Options for select-like widgets. Inferred from `z.enum()` when omitted. */
  options?: readonly HelixSelectOption[] | readonly string[];
  /** Render order among siblings — lower first; fields without order keep shape order. */
  order?: number;
  /** Label of the add button for array widgets. */
  addLabel?: string;
  /** Label of the remove button for array widgets. */
  removeLabel?: string;
  /** Hides the field (and excludes its errors from parent validity) when true. */
  hiddenWhen?: (root: TRoot) => boolean;
  /** Disables the field when truthy; a string return becomes the disabled reason. */
  disabledWhen?: (root: TRoot) => boolean | string;
  readonlyWhen?: (root: TRoot) => boolean;
  /** Marks the field required (signal-forms `required()` with `when`). */
  requiredWhen?: (root: TRoot) => boolean;
  /**
   * Escape hatch: additional signal-forms rules applied to this field's path
   * inside the generated schema (e.g. `p => validate(p, ...)`).
   */
  extraSchema?: (path: SchemaPath<any>) => void;
  /** Arbitrary passthrough for custom widgets. */
  [key: string]: unknown;
}

/**
 * Typed registry backing {@link helixMeta}. Checked before the zod global
 * registry by {@link readHelixMeta}.
 */
export const helixFieldMetaRegistry = z.registry<HelixFieldMeta>();

/**
 * Attaches Helix UI metadata to a Zod schema and returns the **same** instance.
 *
 * Prefer this over `.meta()`, which clones the schema — metadata must live on
 * the exact instance composed into the `z.object()` shape for the walker to
 * find it.
 *
 * @example
 * const UserSchema = z.object({
 *   email: helixMeta(z.email(), { label: 'E-mail', placeholder: 'you@example.com' }),
 * });
 */
export function helixMeta<S extends z.ZodType, TRoot = Record<string, unknown>>(
  schema: S,
  meta: HelixFieldMeta<TRoot>,
): S {
  (helixFieldMetaRegistry as any).add(schema, meta);
  return schema;
}

const WRAPPER_TYPES = new Set(['optional', 'nullable', 'default', 'readonly', 'nonoptional']);

function metaOf(schema: z.ZodType): HelixFieldMeta | undefined {
  const registered = helixFieldMetaRegistry.get(schema);
  if (registered) return registered as HelixFieldMeta;

  const globalMeta = schema.meta();
  if (!globalMeta) return undefined;

  const { title, description, helix, ...rest } = globalMeta as {
    title?: string;
    description?: string;
    helix?: HelixFieldMeta;
  };
  const mapped: HelixFieldMeta = { ...rest };
  if (title !== undefined) mapped.label = title;
  if (description !== undefined) mapped.hint = description;
  return { ...mapped, ...helix };
}

/**
 * Reads {@link HelixFieldMeta} from a Zod schema: the typed registry first,
 * then the zod global registry (`.meta()` — `title` → `label`,
 * `description` → `hint`, `helix` key merged on top).
 *
 * Wrapper types (`optional`, `nullable`, `default`, `readonly`) are unwrapped
 * and their metadata merged — outermost wins.
 */
export function readHelixMeta(schema: z.ZodType): HelixFieldMeta {
  const layers: HelixFieldMeta[] = [];
  let current: z.ZodType | undefined = schema;

  while (current) {
    const meta = metaOf(current);
    if (meta) layers.push(meta);

    const def: { type: string } = (current as any)._zod.def;
    current = WRAPPER_TYPES.has(def.type) ? ((current as any).unwrap() as z.ZodType) : undefined;
  }

  // Innermost first so outer layers overwrite inner ones.
  return layers.reverse().reduce<HelixFieldMeta>((acc, layer) => ({ ...acc, ...layer }), {});
}
