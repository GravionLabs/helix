import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// The inset layout of HxAppShell (#1103): the stylesheet is plain CSS, so the rules are checked as text.
const css = readFileSync(
  resolve(__dirname, '../../projects/desktop/styles/styles.css'),
  'utf8',
).replace(/\/\*[\s\S]*?\*\//g, '');

/** The declarations of every rule whose selector list contains `selector`, joined. */
function declarations(selector: string): string {
  const found: string[] = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(',').map((s) => s.trim());
    if (selectors.includes(selector)) found.push(match[2]);
  }
  return found.join(';');
}

const PANELS = [
  '.hx-app-shell-body > .hx-activity-bar',
  '.hx-app-shell-sidebar',
  '.hx-app-shell-content',
  '.hx-app-shell-body > [slot="panel"]',
];

describe('desktop stylesheet: inset layout of HxAppShell', () => {
  it('takes gap and radius from the helix-shell tokens, with fallbacks', () => {
    const shell = declarations('.hx-app-shell');
    expect(shell).toContain('--hx-panel-gap: var(--helix-panel-gap, 4px)');
    expect(shell).toContain('--hx-panel-radius: var(--helix-panel-radius, 6px)');
  });

  it.each(PANELS)('frames %s as an inset panel', (panel) => {
    const rules = declarations(panel);
    expect(rules).toContain('border: 1px solid var(--h-content-border-color)');
    expect(rules).toContain('border-radius: var(--hx-panel-radius)');
    expect(rules).toContain('background: var(--h-content-background');
  });

  it('keeps the gap to the window edge and between the panels', () => {
    expect(declarations('.hx-app-shell-body')).toContain('padding: var(--hx-panel-gap)');
    expect(declarations('.hx-app-shell-body > .hx-activity-bar')).toContain(
      'margin-inline-end: var(--hx-panel-gap)',
    );
    expect(declarations('.hx-app-shell-body > [slot="panel"]')).toContain(
      'margin-inline-start: var(--hx-panel-gap)',
    );
  });

  it('lets the resizer fill the gap between the sidebar and the content', () => {
    const resizer = declarations('.hx-app-shell-resizer');
    expect(resizer).toContain('width: var(--hx-panel-gap)');
    expect(resizer).not.toContain('margin');
    expect(declarations('.hx-app-shell-resizer::before')).toContain('inset-inline: -3px');
  });

  it('lays the status bar flat on the frame inside the shell', () => {
    expect(declarations('.hx-app-shell > .hx-status-bar')).toContain('border-block-start: 0');
  });

  it('uses only --h-* and the shell panel tokens, no colours of its own', () => {
    for (const panel of PANELS) {
      expect(declarations(panel)).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(/i);
    }
  });
});
