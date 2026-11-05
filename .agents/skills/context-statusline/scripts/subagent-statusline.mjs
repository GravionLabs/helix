#!/usr/bin/env node
// Claude Code subagentStatusLine: one {"id","content"} JSON line per subagent task.
// Row: <agentType> <model> ctx:<pct>% (<k>k/<size>k) · <label>; yellow from min(50%, 250k) tokens, red from min(80%, 500k).
// Fields per task: tokenCount, contextWindowSize (Claude Code subagentStatusLine payload, https://code.claude.com/docs/en/statusline).
// Only <k>k when contextWindowSize is missing or 0; 1,000,000 renders 1M. Invalid input: no output, exit 0.
import { readFileSync } from 'node:fs';

const E = '\x1b';
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const tok = (n) => (n >= 999500 ? `${Math.floor((n + 5e4) / 1e5) / 10}M`.replace('.0M', 'M') : `${Math.floor((n + 500) / 1000)}k`);
const str = (v) => (typeof v === 'string' ? v : '');

function row(t) {
  if (!t || typeof t !== 'object' || t.id === undefined || t.id === null) return null;
  const agent = str(t.agentType) || str(t.name) || 'agent';
  const model = str(t.model).replace(/^claude-/, '').replace(/-\d{8}$/, '');
  const tokens = num(t.tokenCount);
  const size = num(t.contextWindowSize);
  const label = str(t.label) || str(t.description);
  const k = tok(tokens);
  let ctx;
  if (size > 0) {
    const pct = Math.floor((tokens * 100) / size);
    const color = tokens < Math.min(size / 2, 250000) ? 32 : tokens < Math.min(size * 0.8, 500000) ? 33 : 31;
    ctx = ` ${E}[${color}mctx:${pct}% (${k}/${tok(size)})${E}[0m`;
  } else {
    ctx = ` ${k}`;
  }
  const m = model ? ` ${E}[90m${model}${E}[0m` : '';
  return { id: t.id, content: `${E}[36m${agent}${E}[0m${m}${ctx} · ${label}` };
}

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const tasks = Array.isArray(input?.tasks) ? input.tasks : [];
  const lines = tasks.map(row).filter(Boolean).map((r) => JSON.stringify(r));
  if (lines.length) process.stdout.write(lines.join('\n') + '\n');
} catch { /* invalid input: no output */ }
