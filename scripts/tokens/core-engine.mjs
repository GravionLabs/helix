// TEMPORARY (until helix-core is removed, epic #585): the styling engine and the presets of the built helix-core
// (`dist/core`), kept as the reference the token resolver is checked against. Nothing in the token pipeline
// uses it any more; the golden snapshot, the equality tests and the one-off extraction do.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const FESM = path.join(ROOT, 'dist/core/fesm2022');

/**
 * What the engine emits for a preset: primitive, semantic and global variables (light, then dark under
 * `darkSelector`), then every component's variables, in the order the engine emits them at runtime.
 */
export function resolvePreset(Theme, preset, darkSelector = '.app-dark', { components = true } = {}) {
  Theme.setTheme({ preset, options: { prefix: 'h', darkModeSelector: darkSelector } });
  const common = Theme.getCommon('common');
  const parts = [common.primitive.css, common.semantic.css, common.global.css];
  if (components) {
    // `true`: every component of the preset; an array: just those.
    const names = Array.isArray(components) ? components : Object.keys(preset.components ?? {}).sort();
    for (const name of names) parts.push(Theme.getComponent(name).css);
  }
  return parts.filter(Boolean).join('\n');
}

export async function loadPreset(name) {
  const engine = await import(path.join(FESM, 'gravionlabs-helix-core-themes.mjs'));
  const module = await import(path.join(FESM, `gravionlabs-helix-core-themes-${name}.mjs`));
  const preset = module[`${name}Preset`];
  if (!preset) throw new Error(`no ${name}Preset exported by themes/${name}`);
  return { Theme: engine.Theme, preset };
}
