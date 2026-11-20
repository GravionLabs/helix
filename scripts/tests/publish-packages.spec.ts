import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs script without types
import { isPublished, publishPackages } from '../publish-packages.mjs';

type R = { status: number; stdout: string; stderr: string };
const ok = (stdout = ''): R => ({ status: 0, stdout, stderr: '' });
const fail = (stderr: string): R => ({ status: 1, stdout: '', stderr });

/** Fake npm: `onRegistry` lists name@version already published; `publishErrors` maps a dir to its error. */
function fakeNpm(onRegistry: string[], publishErrors: Record<string, string> = {}) {
  const calls: string[][] = [];
  const exec = (_cmd: string, args: string[]): R => {
    calls.push(args);
    if (args[0] === 'view') {
      const spec = args[1];
      return onRegistry.includes(spec)
        ? ok(`${spec.split('@').pop()}\n`)
        : fail('npm error code E404');
    }
    const dir = args[1].replace('./', '');
    return publishErrors[dir] ? fail(publishErrors[dir]) : ok();
  };
  return { exec, calls };
}
const readName = (dir: string) => `@gravionlabs/helix-${dir}`;
const quiet = () => undefined;

describe('publish-packages', () => {
  it('publishes everything when nothing is on npm', () => {
    const { exec, calls } = fakeNpm([]);
    const r = publishPackages(['ui', 'shell'], '1.0.0', { exec, readName, log: quiet });
    expect(r).toEqual({
      published: ['@gravionlabs/helix-ui', '@gravionlabs/helix-shell'],
      skipped: [],
    });
    expect(calls.filter((c) => c[0] === 'publish')).toHaveLength(2);
  });

  it('skips packages already at that version and publishes the rest', () => {
    const { exec, calls } = fakeNpm([
      '@gravionlabs/helix-ui@1.0.0',
      '@gravionlabs/helix-shell@1.0.0',
    ]);
    const r = publishPackages(['ui', 'shell', 'desktop'], '1.0.0', { exec, readName, log: quiet });
    expect(r.skipped).toEqual(['@gravionlabs/helix-ui', '@gravionlabs/helix-shell']);
    expect(r.published).toEqual(['@gravionlabs/helix-desktop']);
    expect(calls.filter((c) => c[0] === 'publish')).toEqual([
      ['publish', './desktop', '--access', 'public', '--provenance'],
    ]);
  });

  it('fails on a real publish error', () => {
    const { exec } = fakeNpm([], { desktop: 'E404 you do not have permission' });
    expect(() =>
      publishPackages(['ui', 'desktop'], '1.0.0', { exec, readName, log: quiet }),
    ).toThrow(/desktop@1\.0\.0 failed/);
  });

  it('does not mistake a registry failure for an unpublished version', () => {
    const exec = () => fail('npm error code ECONNRESET');
    expect(() => isPublished('x', '1.0.0', exec)).toThrow(/ECONNRESET/);
  });
});
