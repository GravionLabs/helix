// The Stylelint config of the Helix lint preset (ADR 0008, ADR 0009): colors and font sizes come from the tokens.
// No `extends` and no formatting rules: an app adds the preset next to its own base config.

/** A type scale token, without a fallback value. */
const TOKEN = String.raw`var\(\s*--h-font-size-[a-z0-9]+\s*\)`;

const FONT_SIZES = [
  new RegExp(`^${TOKEN}$`),
  /^(inherit|initial|unset|revert|smaller|larger)$/,
  // calc() and clamp() over at least one token: numbers and operators, no literal with a unit and no other var()
  new RegExp(
    String.raw`^(?=[\s\S]*var\()(?:calc|clamp)\((?:${TOKEN}|(?:calc|clamp)\(|[\d.\s+*/(),-])*\)$`,
  ),
];

/** @type {import('stylelint').Config} */
export default {
  rules: {
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    'declaration-property-value-allowed-list': { 'font-size': FONT_SIZES },
  },
};

const isNameList = (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((entry) => typeof entry === 'string' && entry.trim() !== '');

/**
 * One allowlist entry as a Stylelint `overrides` entry that turns `rules` off for `files`.
 *
 * @param {{ files: string[], rules: string[], reason: string }} entry
 * @returns {{ files: string[], rules: Record<string, null> }}
 * @throws {Error} without a reason, files or rules.
 */
export function helixAllow({ files, rules, reason } = {}) {
  if (typeof reason !== 'string' || reason.trim() === '') {
    throw new Error('helixAllow: every allowlist entry needs a `reason`.');
  }
  if (!isNameList(files)) throw new Error(`helixAllow: \`files\` is missing (${reason}).`);
  if (!isNameList(rules)) throw new Error(`helixAllow: \`rules\` is missing (${reason}).`);
  return { files, rules: Object.fromEntries(rules.map((rule) => [rule, null])) };
}
