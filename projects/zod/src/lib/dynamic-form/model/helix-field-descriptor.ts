import type { z } from 'zod';
import type { HelixFieldMeta, HelixSelectOption, HelixWidgetKind } from './helix-field-meta';

/**
 * Renderer-facing description of one form field, produced by
 * `zodToFieldDescriptors` from an annotated Zod schema.
 */
export interface HelixFieldDescriptor {
  /** Property name in the parent shape; `''` for the root descriptor. */
  key: string;
  /** Path from the root model to this field. */
  path: readonly string[];
  /** Resolved widget: `meta.widget` override or the kind inferred from the Zod type. */
  widget: HelixWidgetKind;
  meta: HelixFieldMeta;
  /** The unwrapped inner Zod type (optional/nullable/default wrappers peeled). */
  zodType: z.ZodType;
  /** The original Zod schema including wrappers — used to build default values. */
  zodSource: z.ZodType;
  /** True when the field is neither optional nor nullable and has no default. */
  required: boolean;
  /** Native `<input type>` for input-based widgets. */
  inputType?: string;
  /** Options for select-like widgets (from meta or `z.enum()`). */
  options?: readonly HelixSelectOption[];
  /** Child descriptors for object fields, sorted by `meta.order`. */
  children?: readonly HelixFieldDescriptor[];
  /** Element descriptor for array fields (path relative to the array item). */
  itemDescriptor?: HelixFieldDescriptor;
  /** Variant map for discriminated unions. */
  union?: {
    discriminator: string;
    /** Discriminator literal → object descriptor of that variant. */
    variants: ReadonlyMap<string | number | boolean, HelixFieldDescriptor>;
  };
}
