import {
  applyEach,
  applyWhenValue,
  disabled,
  type FieldContext,
  hidden,
  readonly,
  required,
  type SchemaFn,
  type SchemaPath,
  validateStandardSchema,
} from '@angular/forms/signals';
import type { z } from 'zod';
import type { HelixFieldDescriptor } from '../model/helix-field-descriptor';

/**
 * Builds the signal-forms schema for a Zod-driven dynamic form:
 *
 * 1. Root-level `validateStandardSchema(rootPath, zodSchema)` — Zod issue
 *    paths route errors onto the matching child fields, including cross-field
 *    `.refine()` errors with a `path`.
 * 2. Conditional field state from {@link HelixFieldMeta} predicates
 *    (`hiddenWhen`/`disabledWhen`/`readonlyWhen`/`requiredWhen`), evaluated
 *    against the root form value.
 * 3. `meta.extraSchema` escape-hatch rules per field.
 * 4. `applyEach` for array items and `applyWhenValue` for discriminated-union
 *    variants, so variant/item rules stay dormant unless active.
 */
export function buildHelixSchema<T extends Record<string, unknown>>(
  zodSchema: z.ZodObject,
  root: HelixFieldDescriptor,
): SchemaFn<T> {
  return (rootPath) => {
    validateStandardSchema(rootPath as any, zodSchema as any);
    applyDescriptorRules(rootPath as any, root, rootPath as any);
  };
}

/** Reads the root form value from any nested logic context. */
function rootValueOf(ctx: FieldContext<any, any>, rootPath: SchemaPath<any>): any {
  return (ctx as { valueOf(p: SchemaPath<any>): any }).valueOf(rootPath);
}

function applyConditionRules(
  path: SchemaPath<any>,
  descriptor: HelixFieldDescriptor,
  rootPath: SchemaPath<any>,
): void {
  const meta = descriptor.meta;

  if (meta.hiddenWhen) {
    hidden(
      path as any,
      (ctx: FieldContext<any, any>) => !!meta.hiddenWhen?.(rootValueOf(ctx, rootPath)),
    );
  }
  if (meta.disabledWhen) {
    disabled(
      path as any,
      (ctx: FieldContext<any, any>) => meta.disabledWhen?.(rootValueOf(ctx, rootPath)) ?? false,
    );
  }
  if (meta.readonlyWhen) {
    readonly(
      path as any,
      (ctx: FieldContext<any, any>) => !!meta.readonlyWhen?.(rootValueOf(ctx, rootPath)),
    );
  }
  if (meta.requiredWhen) {
    required(path as any, {
      when: (ctx: FieldContext<any, any>) => !!meta.requiredWhen?.(rootValueOf(ctx, rootPath)),
    });
  }
  meta.extraSchema?.(path as any);
}

function applyDescriptorRules(
  path: SchemaPath<any>,
  descriptor: HelixFieldDescriptor,
  rootPath: SchemaPath<any>,
): void {
  // Root-level conditions make no sense on the form itself — only on fields.
  if (path !== rootPath) applyConditionRules(path, descriptor, rootPath);

  for (const child of descriptor.children ?? []) {
    applyDescriptorRules((path as any)[child.key], child, rootPath);
  }

  if (descriptor.itemDescriptor) {
    const item = descriptor.itemDescriptor;
    applyEach(
      path as any,
      ((itemPath: any) => {
        applyDescriptorRules(itemPath, item, rootPath);
      }) as any,
    );
  }

  if (descriptor.union) {
    const { discriminator, variants } = descriptor.union;
    for (const [tag, variant] of variants) {
      applyWhenValue(
        path as any,
        ((value: any) => value?.[discriminator] === tag) as (value: any) => value is any,
        ((variantPath: any) => {
          // The union field itself carries the variant's children.
          for (const child of variant.children ?? []) {
            applyDescriptorRules(variantPath[child.key], child, rootPath);
          }
        }) as any,
      );
    }
  }
}
