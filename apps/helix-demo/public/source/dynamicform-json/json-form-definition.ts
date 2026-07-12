import { helixMeta } from '@gravionlabs/helix-zod';
import { z } from 'zod';

/**
 * Compact JSON form definition, as it could be stored in a database. The
 * definition itself is validated with Zod before it is turned into a form
 * schema, so malformed rows fail with a readable error.
 */
export const JsonFieldDefinitionSchema = z.object({
  key: z.string().min(1),
  type: z.enum(['text', 'email', 'password', 'textarea', 'number', 'checkbox', 'select', 'date']),
  label: z.string().optional(),
  hint: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  minLength: z.number().int().optional(),
  maxLength: z.number().int().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(z.string()).min(1).optional(),
  default: z.unknown().optional(),
  order: z.number().optional(),
});

export const JsonFormDefinitionSchema = z.object({
  title: z.string().optional(),
  submitLabel: z.string().optional(),
  fields: z.array(JsonFieldDefinitionSchema).min(1),
});

export type JsonFieldDefinition = z.infer<typeof JsonFieldDefinitionSchema>;
export type JsonFormDefinition = z.infer<typeof JsonFormDefinitionSchema>;

function fieldSchema(field: JsonFieldDefinition): z.ZodType {
  switch (field.type) {
    case 'text':
    case 'password':
    case 'textarea': {
      let schema = z.string();
      if (field.minLength != null)
        schema = schema.min(field.minLength, `At least ${field.minLength} characters`);
      else if (field.required) schema = schema.min(1, 'This field is required');
      if (field.maxLength != null)
        schema = schema.max(field.maxLength, `At most ${field.maxLength} characters`);
      return schema.default((field.default as string) ?? '');
    }
    case 'email': {
      const email = z.email('Invalid e-mail address');
      // An optional e-mail may stay empty; a required one must parse.
      return (field.required ? email : email.or(z.literal(''))).default(
        (field.default as string) ?? '',
      );
    }
    case 'number': {
      let schema = z.number();
      if (field.min != null) schema = schema.min(field.min, `Minimum is ${field.min}`);
      if (field.max != null) schema = schema.max(field.max, `Maximum is ${field.max}`);
      return schema.nullable().default((field.default as number) ?? null);
    }
    case 'checkbox': {
      const schema = z.boolean().default((field.default as boolean) ?? false);
      return field.required ? schema.refine((v) => v, 'This must be checked') : schema;
    }
    case 'select': {
      const options = field.options ?? [];
      return z
        .enum(options as [string, ...string[]])
        .default((field.default as string) ?? options[0]);
    }
    case 'date':
      return z
        .date()
        .nullable()
        .default((field.default as Date) ?? null);
  }
}

/**
 * Turns a validated {@link JsonFormDefinition} into an annotated Zod object
 * schema that `<helix-dynamic-form>` can render directly.
 */
export function buildFormSchema(definition: JsonFormDefinition): z.ZodObject {
  const shape: Record<string, z.ZodType> = {};
  definition.fields.forEach((field, index) => {
    shape[field.key] = helixMeta(fieldSchema(field), {
      label: field.label,
      hint: field.hint,
      placeholder: field.placeholder,
      order: field.order ?? index,
      // Widget kinds not derivable from the Zod type (password/textarea).
      widget: field.type === 'password' || field.type === 'textarea' ? field.type : undefined,
      requiredWhen: field.required ? () => true : undefined,
    });
  });
  return z.object(shape);
}

/**
 * Parses a raw JSON string (e.g. loaded from a database) into a renderable
 * form schema. Returns a readable error instead of throwing.
 */
export function parseFormDefinition(
  json: string,
): { definition: JsonFormDefinition; schema: z.ZodObject } | { error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (e) {
    return { error: `Invalid JSON: ${(e as Error).message}` };
  }
  const result = JsonFormDefinitionSchema.safeParse(raw);
  if (!result.success) return { error: z.prettifyError(result.error) };
  return { definition: result.data, schema: buildFormSchema(result.data) };
}
