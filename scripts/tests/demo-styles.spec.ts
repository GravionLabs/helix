import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, posix, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../..');
const read = (file: string) => readFileSync(join(ROOT, file), 'utf8');

const scripts: Record<string, string> = JSON.parse(read('package.json')).scripts;
const demoStyles: string[] = JSON.parse(read('angular.json')).projects['helix-demo'].architect.build
  .options.styles;

/** `dist/<pkg>/styles.css` that a package script writes with the tailwindcss CLI (`-o …`). */
const tailwindOutputs = (text: string): string[] =>
  [...text.matchAll(/-o (dist\/[\w-]+\/styles\.css)/g)].map((m) => m[1]);

/** `dist/<pkg>/styles.css` that ng-packagr copies as an asset of a library (helix-desktop). */
function packagedStylesheets(): string[] {
  const found: string[] = [];
  for (const dir of readdirSync(join(ROOT, 'projects'), { withFileTypes: true })) {
    const file = join('projects', dir.name, 'ng-package.json');
    if (!dir.isDirectory() || !existsSync(join(ROOT, file))) continue;
    const pkg = JSON.parse(read(file));
    const copiesStyles = (pkg.assets ?? []).some(
      (a: string | { glob?: string }) => typeof a === 'object' && a.glob === 'styles.css',
    );
    if (copiesStyles)
      found.push(posix.join(posix.normalize(pkg.dest.replace(/^(\.\.\/)+/, '')), 'styles.css'));
  }
  return found;
}

/** A script with every `pnpm <script>` it calls inlined, so the whole command line can be searched. */
const expand = (name: string, seen = new Set<string>()): string => {
  if (seen.has(name)) return '';
  seen.add(name);
  return scripts[name].replace(/pnpm ([\w:-]+)/g, (call, inner) =>
    scripts[inner] ? expand(inner, seen) : call,
  );
};

const shipped = [
  ...new Set([...Object.values(scripts).flatMap(tailwindOutputs), ...packagedStylesheets()]),
];

describe('demo stylesheets', () => {
  it('finds the library stylesheets', () => {
    expect(shipped).toEqual(
      expect.arrayContaining([
        'dist/shell/styles.css',
        'dist/ag-grid/styles.css',
        'dist/desktop/styles.css',
      ]),
    );
  });

  it.each(shipped)('the demo loads %s', (stylesheet) => {
    expect(demoStyles).toContain(stylesheet);
  });

  it.each(shipped)('pnpm start builds and watches %s before ng serve', (stylesheet) => {
    const start = expand('start');
    const serve = start.indexOf('"ng serve helix-demo"');
    expect(serve).toBeGreaterThan(-1);
    const built = start.indexOf(`-o ${stylesheet}`);
    expect(built, 'built before the dev server').toBeGreaterThan(-1);
    expect(built).toBeLessThan(serve);
    expect(start).toContain(`-o ${stylesheet} --watch`);
  });
});
