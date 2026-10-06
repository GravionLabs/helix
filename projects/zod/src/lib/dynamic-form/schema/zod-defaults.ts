import type { z } from 'zod';

type AnyZod = z.ZodType & {
  _zod: { def: Record<string, unknown> & { type: string } };
};

const defOf = (schema: z.ZodType) => (schema as AnyZod)._zod.def;

/**
 * Builds a fully-populated initial model value for a Zod schema — signal forms
 * require a concrete model shape up front.
 *
 * Rules: `.default()` wins; strings → `''`; numbers/dates → `null` (paired
 * with parse-transforming widgets); booleans → `false`; enums → first option;
 * arrays → `[]`; objects → recursed shape; discriminated unions → default of
 * the first variant; `optional` unwraps to its inner default, `nullable` → `null`.
 */
export function buildDefaultValue(schema: z.ZodType): unknown {
  const def = defOf(schema);

  switch (def.type) {
    case 'default': {
      const dv = def['defaultValue'];
      return typeof dv === 'function' ? (dv as () => unknown)() : dv;
    }
    case 'optional': {
      // Signal forms create no child field for an `undefined` value, so optional
      // fields get their inner default (`''`, `null`, …) to stay navigable.
      return buildDefaultValue((schema as unknown as { unwrap(): z.ZodType }).unwrap());
    }
    case 'readonly':
    case 'nonoptional':
      return buildDefaultValue((schema as unknown as { unwrap(): z.ZodType }).unwrap());
    case 'nullable':
      return null;
    case 'string':
      return '';
    case 'number':
    case 'int':
    case 'date':
      return null;
    case 'boolean':
      return false;
    case 'enum': {
      const options = (schema as unknown as { options: readonly unknown[] }).options;
      return options[0];
    }
    case 'literal': {
      const values = def['values'] as readonly unknown[];
      return values[0];
    }
    case 'array':
      return [];
    case 'object': {
      const shape = (schema as unknown as { shape: Record<string, z.ZodType> }).shape;
      const value: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(shape)) {
        value[key] = buildDefaultValue(child);
      }
      return value;
    }
    case 'union': {
      const options = (schema as unknown as { options: readonly z.ZodType[] }).options;
      return buildDefaultValue(options[0]);
    }
    default:
      return undefined;
  }
}

/**
 * Optional (non-nullable) leaves hold an empty model value (`null`) so signal
 * forms keep a child field for them; Zod expects them absent. Maps those
 * top-level `null`s to `undefined` before validating/parsing.
 */
export function nullsToAbsent(schema: z.ZodObject, value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;
  const shape = (schema as unknown as { shape: Record<string, z.ZodType> }).shape;
  const result: Record<string, unknown> = { ...(value as Record<string, unknown>) };
  for (const [key, child] of Object.entries(shape)) {
    if (
      result[key] === null &&
      child.safeParse(undefined).success &&
      !child.safeParse(null).success
    ) {
      result[key] = undefined;
    }
  }
  return result;
}
