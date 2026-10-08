let counter = 0;

/** A unique id for generated DOM ids (`aria-controls`, `aria-describedby`, `for`): `hx-select-panel-3`. */
export function nextId(prefix: string): string {
  return `${prefix}-${counter++}`;
}
