#!/usr/bin/env node
// Claude Code statusLine: user@host:dir, model, ctx:<pct>% (<used>k/<size>k), git branch, 5h/7d rate limits. Never fails (exit 0), no network.
// Payload fields: https://code.claude.com/docs/en/statusline (context_window.context_window_size, .used_percentage, .current_usage.*; verified
// 2026-10-22). Copilot CLI fields come from community guides (unverified); without a size only ctx:<pct>% is shown.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { hostname, userInfo } from 'node:os';

const c = (code, s) => `\x1b[${code}m${s}\x1b[00m`;
const pct = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null);
const tok = (n) => (n >= 999500 ? `${Math.floor((n + 5e4) / 1e5) / 10}M`.replace('.0M', 'M') : `${Math.floor((n + 500) / 1000)}k`);
const light = (p) => (p < 50 ? '32' : p < 80 ? '33' : '31'); // traffic light: green <50%, yellow <80%, red otherwise
// ctx with a window size: yellow from min(50%, 250k) tokens, red from min(80%, 500k), so a 1M window warns at 25%/50%.
const ctxLight = (used, size) => (used < Math.min(size / 2, 250000) ? '32' : used < Math.min(size * 0.8, 500000) ? '33' : '31');
const num = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);
// Tokens in the context: sum of current_usage input fields (matches the percentage), else derived from pct * size.
function usedTokens(cw, ctx, size) {
  const u = cw?.current_usage;
  const parts = u && typeof u === 'object' ? [u.input_tokens, u.cache_creation_input_tokens, u.cache_read_input_tokens].map(num) : [];
  if (parts.some((p) => p !== null)) return parts.reduce((a, p) => a + (p ?? 0), 0);
  return Math.round((ctx * size) / 100);
}
const str = (v) => (typeof v === 'string' && v ? v : null);
const git = (dir, args) => {
  const r = spawnSync('git', ['-C', dir, '--no-optional-locks', ...args], { encoding: 'utf8', timeout: 1000, windowsHide: true });
  return r.status === 0 ? r.stdout.trim() : '';
};

function render(input) {
  const dir = str(input.workspace?.current_dir) ?? str(input.cwd) ?? process.cwd();
  let user = 'user';
  try { user = userInfo().username; } catch { /* keep default */ }
  const host = hostname().split('.')[0];
  let out = `${c('01;32', `${user}@${host}`)}:${c('01;34', dir)}`;

  const model = str(input.model?.display_name);
  if (model) out += ` ${c('36', model)}`;
  // Copilot CLI: current_context_used_percentage matches /context, so it wins when present.
  const rawCtx = num(input.context_window?.current_context_used_percentage) ?? num(input.context_window?.used_percentage);
  const ctx = rawCtx === null ? null : Math.round(rawCtx);
  if (ctx !== null) {
    const size = num(input.context_window?.context_window_size);
    const used = size ? usedTokens(input.context_window, rawCtx, size) : 0;
    const detail = size ? ` (${tok(used)}/${tok(size)})` : '';
    out += ` ${c(size ? ctxLight(used, size) : light(ctx), `ctx:${ctx}%${detail}`)}`;
  }

  if (existsSync(dir)) {
    const branch = git(dir, ['symbolic-ref', '--short', '-q', 'HEAD']) || git(dir, ['rev-parse', '--short', 'HEAD']);
    if (branch) out += ` ${c('35', `(${branch})`)}`;
  }

  // Each limit in its own traffic-light colour (<50% green, <80% yellow, else red), like the subagent rows; grey was unreadable.
  for (const [label, key] of [['5h', 'five_hour'], ['7d', 'seven_day']]) {
    const used = pct(input.rate_limits?.[key]?.used_percentage);
    if (used !== null) out += ` ${c(light(used), `${label}:${used}%`)}`;
  }
  return out;
}

try {
  let input = {};
  try {
    const parsed = JSON.parse(readFileSync(0, 'utf8'));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) input = parsed;
  } catch { /* garbage or empty stdin: fall back to defaults */ }
  process.stdout.write(render(input));
} catch { /* never break the status line */ }
