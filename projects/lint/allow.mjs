// The allowlist of the Helix lint preset (ADR 0009): every exception names its files, its rules and a reason.

const isNameList = (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((entry) => typeof entry === 'string' && entry.trim() !== '');

/**
 * One allowlist entry as an ESLint flat config object that turns `rules` off for `files`. Put it after the preset.
 *
 * @param {{ files: string[], rules: string[], reason: string }} entry
 * @returns {import('eslint').Linter.Config}
 * @throws {Error} without a reason, files or rules.
 */
export function helixAllow({ files, rules, reason } = {}) {
  if (typeof reason !== 'string' || reason.trim() === '') {
    throw new Error('helixAllow: every allowlist entry needs a `reason`.');
  }
  if (!isNameList(files)) throw new Error(`helixAllow: \`files\` is missing (${reason}).`);
  if (!isNameList(rules)) throw new Error(`helixAllow: \`rules\` is missing (${reason}).`);
  return {
    name: `helix/allow: ${reason}`,
    files,
    rules: Object.fromEntries(rules.map((rule) => [rule, 'off'])),
  };
}
