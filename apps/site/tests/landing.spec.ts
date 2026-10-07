import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// The Angular demo lives at /demo/, next to the site but outside the VitePress app. A link to it without a
// `target` is intercepted by VitePress's client router, which finds no page and shows the site's 404 until
// the visitor reloads (#535).
const index = readFileSync(resolve(__dirname, '../../../docs/index.md'), 'utf8');
const frontMatter = /^---\n([\s\S]*?)\n---/.exec(index)?.[1] ?? '';

/** The `- theme: …` blocks of `hero.actions`, as `{ link, target }`. */
function heroActions(): { text: string; link: string; target?: string }[] {
  const actions = /\n {2}actions:\n([\s\S]*?)(?=\n\S)/.exec(`\n${frontMatter}`)?.[1] ?? '';
  return actions
    .split(/\n {4}- /)
    .filter(Boolean)
    .map((block) => {
      const field = (name: string) =>
        new RegExp(`(?:^|\\n) {0,6}${name}: (.+)`).exec(block)?.[1].trim();
      return { text: field('text') ?? '', link: field('link') ?? '', target: field('target') };
    });
}

describe('landing page', () => {
  it('has the hero actions the test reads', () => {
    expect(heroActions().map((a) => a.text)).toContain('Live demo');
  });

  it('opens the demo with target _self, so the router does not intercept it', () => {
    const toDemo = heroActions().filter((a) => /^\/demo(\/|$)/.test(a.link));
    expect(toDemo.length).toBeGreaterThan(0);
    for (const action of toDemo) expect(action.target).toBe('_self');
  });
});
