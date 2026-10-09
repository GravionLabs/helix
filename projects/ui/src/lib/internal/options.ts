/** A property name of an option, or a function that reads the value from it. */
export type Accessor<O, R> = string | ((option: O) => R);

/** An option after `optionLabel`, `optionValue` and `optionDisabled` are applied. */
export interface HxOption<V = unknown> {
  label: string;
  value: V;
  disabled: boolean;
}

/** How values are compared to find the chosen option: `Object.is` unless the app passes its own. */
export const compareValues: (a: unknown, b: unknown) => boolean = Object.is;

function read<R>(option: object, accessor: Accessor<unknown, R>, fallback: R): R {
  if (typeof accessor === 'function') return accessor(option);
  return accessor in option ? ((option as Record<string, unknown>)[accessor] as R) : fallback;
}

/**
 * Turns the `options` input of a component into `{ label, value, disabled }` entries. A primitive is its own
 * label and value; an object is read through the accessors (a property name or a function). A missing label is
 * an empty string, a missing value is the object itself, a missing `disabled` is `false`.
 */
export function resolveOptions<V = unknown>(
  options: readonly unknown[],
  label: Accessor<never, string>,
  value: Accessor<never, unknown>,
  disabled: Accessor<never, boolean>,
): HxOption<V>[] {
  return options.map((option) => {
    if (option === null || typeof option !== 'object') {
      return { label: String(option), value: option as V, disabled: false };
    }
    return {
      label: String(read(option, label as Accessor<unknown, string>, '')),
      value: read(option, value as Accessor<unknown, unknown>, option) as V,
      disabled: Boolean(read(option, disabled as Accessor<unknown, boolean>, false)),
    };
  });
}
