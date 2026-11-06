import type { TemplateRef } from '@angular/core';

/** Built-in actions of the topbar. */
export type HelixTopbarBuiltInAction = 'search' | 'darkMode' | 'configurator' | 'alerts';

/** An app-defined action: the template is rendered as is in the chosen zone. */
export interface HelixTopbarCustomAction {
  id: string;
  template: TemplateRef<unknown>;
}

export type HelixTopbarActionPosition = 'start' | 'center' | 'end';

/** One entry of the topbar action list. */
export interface HelixTopbarActionConfig {
  action: HelixTopbarBuiltInAction | HelixTopbarCustomAction;
  /** Zone of the topbar. Default `end`. */
  position?: HelixTopbarActionPosition;
  /** Sort key within a position (ascending); entries with equal or no order keep list order. */
  order?: number;
  /** Hide the entry without removing it from the list. */
  hidden?: boolean;
}

/** The default toolbar: search in the center, dark mode and configurator at the end. */
export const HELIX_DEFAULT_TOPBAR_ACTIONS: readonly HelixTopbarActionConfig[] = [
  { action: 'search', position: 'center', order: 0 },
  { action: 'darkMode', position: 'end', order: 10 },
  { action: 'configurator', position: 'end', order: 20 },
  { action: 'alerts', position: 'end', order: 30 },
];

/** Identity of an entry: the built-in id or the id of the custom action. */
export function helixTopbarActionId(entry: HelixTopbarActionConfig): string {
  return typeof entry.action === 'string' ? entry.action : entry.action.id;
}

/**
 * Changes single entries of a list without rebuilding it. An override replaces the fields it sets
 * on the entry with the same action id; an override without a match is appended.
 */
export function defineTopbarActions(
  defaults: readonly HelixTopbarActionConfig[],
  overrides: readonly HelixTopbarActionConfig[] = [],
): HelixTopbarActionConfig[] {
  const result = defaults.map((entry) => ({ ...entry }));
  for (const override of overrides) {
    const id = helixTopbarActionId(override);
    const index = result.findIndex((entry) => helixTopbarActionId(entry) === id);
    if (index === -1) result.push({ ...override });
    else result[index] = { ...result[index], ...override };
  }
  return result;
}
