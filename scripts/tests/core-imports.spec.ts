import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALLOWED, forbiddenCoreImports } from '../check-core-imports.mjs';

function project(files: Record<string, string>) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'core-imports-'));
  for (const [file, content] of Object.entries(files)) {
    const full = path.join(root, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

describe('helix-core import guard', () => {
  it('finds no forbidden import in the repository', () => {
    expect(forbiddenCoreImports()).toEqual([]);
  });

  it('flags a component entry point in the shell, with file and line', () => {
    const root = project({
      'projects/shell/src/a.ts': "import { ButtonModule } from '@gravionlabs/helix-core/button';\n",
      'projects/shell/src/b.ts':
        "import type { MenuItem } from '@gravionlabs/helix-core/api';\nimport { x } from '@gravionlabs/helix-core/ripple';\n",
    });
    expect(forbiddenCoreImports(root, ALLOWED)).toEqual([
      { file: path.join('projects/shell/src/a.ts'), line: 1, entry: 'button' },
      { file: path.join('projects/shell/src/b.ts'), line: 2, entry: 'ripple' },
    ]);
  });

  it('allows the entry points a library still needs, including sub-paths and vi.mock strings', () => {
    const root = project({
      'projects/shell/src/a.ts':
        "import { a } from '@gravionlabs/helix-core/validators/x';\nvi.mock('@gravionlabs/helix-core/api', () => ({}));\n",
    });
    expect(forbiddenCoreImports(root, ALLOWED)).toEqual([]);
  });

  it('flags the theme engine in the shell: the theme runs on the theme service of helix-ui', () => {
    const root = project({
      'projects/shell/src/a.ts':
        "import { updatePreset } from '@gravionlabs/helix-core/themes';\nimport { provideHelix } from '@gravionlabs/helix-core/config';\n",
    });
    expect(forbiddenCoreImports(root, ALLOWED).map((f) => f.entry)).toEqual(['themes', 'config']);
  });

  it('flags the root entry and any core import in ag-grid', () => {
    const root = project({
      'projects/ag-grid/src/a.ts': "import { a } from '@gravionlabs/helix-core/validators';\n",
      'projects/zod/src/a.ts': "import { a } from '@gravionlabs/helix-core';\n",
    });
    expect(forbiddenCoreImports(root, ALLOWED).map((f) => f.entry)).toEqual([
      '(root)',
      'validators',
    ]);
  });
});
