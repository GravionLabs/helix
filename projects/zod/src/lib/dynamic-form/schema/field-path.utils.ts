import type { FieldTree } from '@angular/forms/signals';

/**
 * Navigates a `FieldTree` by a root-relative property path
 * (e.g. `['address', 'city']`).
 */
export function fieldAtPath(tree: FieldTree<any>, path: readonly string[]): any {
  let current: any = tree;
  for (const key of path) {
    current = current[key];
    if (current === undefined) {
      throw new Error(`[fieldAtPath] No field at path "${path.join('.')}" (missing key "${key}").`);
    }
  }
  return current;
}
