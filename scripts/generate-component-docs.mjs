#!/usr/bin/env node
// Generates docs/components/*.md from projects/core sources.
// Structure/spec: docs/components/_TEMPLATE.md. Run: pnpm docs:components
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CORE_DIR = path.join(ROOT, 'projects/core');
const DOCS_DIR = path.join(ROOT, 'docs/components');

const DECORATOR_KIND = { Component: 'component', Directive: 'directive', Injectable: 'service', Pipe: 'component' };

// Infrastructure modules have no single class-level JSDoc to source a module
// description from (they're a grab-bag of services/helpers/types). Curated by hand;
// everything else below is derived mechanically from source.
const INFRA_DESCRIPTIONS = {
  api: 'Shared services, tokens, and template primitives used across all Helix components.',
  base: 'Base style layer and theming glue shared by every Helix component.',
  basecomponent: 'Abstract base class providing pass-through, styling, and config plumbing for all Helix components.',
  baseeditableholder: 'Abstract base class for form components that hold an editable value.',
  baseinput: 'Abstract base class for input components (name, size, invalid, fluid state).',
  basemodelholder: 'Abstract base class for components that hold a model value via writable signals.',
  bind: 'Directive that binds arbitrary attribute/class/style maps to a host element (pass-through backbone).',
  classnames: 'Utility for composing CSS class strings from arbitrary values.',
  config: "Global Helix configuration: `provideHelix()`, theme, locale/translations, z-index, and filter modes.",
  dom: 'Low-level DOM helper classes (connected-overlay scroll handling, DomHandler).',
  dragdrop: "Drag-and-drop directives (`hDraggable`, `hDroppable`).",
  dynamicdialog: 'Service-based dialogs: open any component in a dialog at runtime via `DialogService`.',
  icons: 'Built-in SVG icon components used internally by Helix components.',
  motion: 'Enter/leave animation directive built on `@primeuix/motion`.',
  overlay: 'Generic overlay container with configurable positioning, transitions, and pass-through.',
  passthrough: "Pass-through (`pt`) infrastructure: merge and provide attribute maps for component internals.",
  'ts-helpers': 'Tiny TypeScript runtime helpers shared by the library.',
  types: 'Shared pass-through type definitions for every Helix component module.',
  usestyle: 'Runtime CSS injection service used by the theming layer.',
  utils: 'Object, input-transform, and unique-id helpers shared across components.',
  validators: 'Reactive-forms `Validators` extensions with translatable error messages.',
};

function listModuleDirs() {
  return fs
    .readdirSync(CORE_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

function moduleFiles(moduleDir) {
  const dir = path.join(CORE_DIR, moduleDir);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'public_api.ts')
    .map((f) => path.join(dir, f));
}

function buildProgram() {
  const configPath = path.join(CORE_DIR, 'tsconfig.lib.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, CORE_DIR);
  const rootNames = fs
    .readdirSync(CORE_DIR, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts'))
    .map((e) => path.join(e.parentPath ?? e.path, e.name));
  return ts.createProgram(rootNames, parsed.options);
}

function jsDocDescription(node) {
  const tags = ts.getJSDocCommentsAndTags(node);
  for (const tag of tags) {
    if (!ts.isJSDoc(tag)) continue;
    const comment = ts.getTextOfJSDocComment(tag.comment);
    if (comment) return comment.trim().split('\n')[0].trim();
  }
  return '';
}

function propertyDescription(node) {
  return jsDocDescription(node);
}

function decoratorInfo(node) {
  const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : undefined;
  if (!decorators) return undefined;
  for (const dec of decorators) {
    const expr = dec.expression;
    if (!ts.isCallExpression(expr) || !ts.isIdentifier(expr.expression)) continue;
    const name = expr.expression.text;
    if (!(name in DECORATOR_KIND)) continue;
    const arg = expr.arguments[0];
    let selector;
    if (arg && ts.isObjectLiteralExpression(arg)) {
      for (const prop of arg.properties) {
        if (ts.isPropertyAssignment(prop) && prop.name.getText() === 'selector' && ts.isStringLiteralLike(prop.initializer)) {
          selector = prop.initializer.text;
        }
      }
    }
    return { kind: DECORATOR_KIND[name], decoratorName: name, selector };
  }
  return undefined;
}

const INPUT_FNS = new Set(['input', 'model']);
const OUTPUT_FNS = new Set(['output']);

function callRootName(expr) {
  // input(...) -> "input"; input.required(...) -> "input"
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.expression)) return expr.expression.text;
  return undefined;
}

function unwrapSignalType(checker, type) {
  // InputSignal<T>, InputSignalWithTransform<T, _>, ModelSignal<T>, OutputEmitterRef<T> -> T
  if (type.aliasSymbol && type.aliasTypeArguments?.length) {
    return checker.typeToString(type.aliasTypeArguments[0], undefined, ts.TypeFormatFlags.NoTruncation);
  }
  const target = type;
  if ((target).typeArguments?.length) {
    return checker.typeToString(target.typeArguments[0], undefined, ts.TypeFormatFlags.NoTruncation);
  }
  return checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation);
}

function defaultValueText(callExpr) {
  const [first] = callExpr.arguments;
  if (!first) return undefined;
  if (first.kind === ts.SyntaxKind.UndefinedKeyword || first.getText() === 'undefined') return undefined;
  return first.getText();
}

function collectSignalMember(checker, member) {
  if (!ts.isPropertyDeclaration(member) || !member.initializer) return undefined;
  if (!ts.isCallExpression(member.initializer)) return undefined;
  const root = callRootName(member.initializer.expression);
  if (!root) return undefined;
  const name = member.name.getText();
  const type = checker.getTypeAtLocation(member);
  const typeText = unwrapSignalType(checker, type);
  const description = propertyDescription(member);
  if (INPUT_FNS.has(root)) {
    return { io: 'input', name, type: typeText, default: defaultValueText(member.initializer), description };
  }
  if (OUTPUT_FNS.has(root)) {
    return { io: 'output', name, type: `output<${typeText}>()`, description };
  }
  return undefined;
}

function collectLegacyDecoratedMember(checker, member) {
  if (!ts.isPropertyDeclaration(member) || !ts.canHaveDecorators(member)) return undefined;
  const decorators = ts.getDecorators(member);
  if (!decorators?.length) return undefined;
  const name = member.name.getText();
  const description = propertyDescription(member);
  for (const dec of decorators) {
    const expr = dec.expression;
    const decName = ts.isCallExpression(expr) && ts.isIdentifier(expr.expression) ? expr.expression.text : undefined;
    if (decName === 'Input') {
      const type = checker.getTypeAtLocation(member);
      return { io: 'input', name, type: checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation), default: undefined, description };
    }
    if (decName === 'Output') {
      const type = checker.getTypeAtLocation(member);
      const typeText = unwrapSignalType(checker, type);
      return { io: 'output', name, type: `output<${typeText}>()`, description };
    }
  }
  return undefined;
}

function documentClass(checker, classNode, info) {
  const name = classNode.name?.getText();
  if (!name) return undefined;
  const description = jsDocDescription(classNode);
  const inputs = [];
  const outputs = [];
  for (const member of classNode.members) {
    const signal = collectSignalMember(checker, member) ?? collectLegacyDecoratedMember(checker, member);
    if (!signal) continue;
    if (signal.io === 'input') inputs.push(signal);
    else outputs.push(signal);
  }
  return { name, kind: info.kind, selector: info.selector, description, inputs, outputs };
}

function documentService(classNode) {
  const name = classNode.name?.getText();
  if (!name) return undefined;
  return { name, description: jsDocDescription(classNode) };
}

function collectExportedTypes(sourceFile) {
  const types = [];
  for (const stmt of sourceFile.statements) {
    const isExported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) continue;
    if (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) {
      types.push({ name: stmt.name.text, description: jsDocDescription(stmt) });
    }
  }
  return types;
}

function collectExportedFunctions(sourceFile) {
  const fns = [];
  for (const stmt of sourceFile.statements) {
    const isExported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported || !ts.isFunctionDeclaration(stmt) || !stmt.name) continue;
    fns.push({ name: stmt.name.text, description: jsDocDescription(stmt) });
  }
  return fns;
}

function analyzeModule(program, moduleDir) {
  const checker = program.getTypeChecker();
  const files = moduleFiles(moduleDir);
  const components = [];
  const services = [];
  const types = [];
  const functions = [];

  for (const file of files) {
    const sourceFile = program.getSourceFile(file);
    if (!sourceFile) continue;
    types.push(...collectExportedTypes(sourceFile));
    functions.push(...collectExportedFunctions(sourceFile));
    for (const stmt of sourceFile.statements) {
      if (!ts.isClassDeclaration(stmt)) continue;
      const isExported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!isExported) continue;
      const info = decoratorInfo(stmt);
      if (!info) continue;
      if (info.kind === 'service') {
        const service = documentService(stmt);
        if (service) services.push(service);
      } else {
        const doc = documentClass(checker, stmt, info);
        if (doc) components.push(doc);
      }
    }
  }
  return { components, services, types, functions };
}

// The declaration whose name matches the directory name (case-insensitive) is the
// module's headline export — used for the page title and one-line description.
function findPrimaryDeclaration(moduleDir, analysis) {
  const key = moduleDir.replace(/-/g, '').toLowerCase();
  const candidates = [...analysis.components, ...analysis.services, ...analysis.types];
  return candidates.find((c) => c.name.toLowerCase() === key);
}

const TITLE_OVERRIDES = { api: 'API', 'ts-helpers': 'TS Helpers', dynamicdialog: 'DynamicDialog', dragdrop: 'DragDrop' };

function moduleTitle(moduleDir, primary) {
  if (primary) return primary.name;
  if (TITLE_OVERRIDES[moduleDir]) return TITLE_OVERRIDES[moduleDir];
  return moduleDir[0].toUpperCase() + moduleDir.slice(1);
}

function publicApiNamedExports(moduleDir) {
  const file = path.join(CORE_DIR, moduleDir, 'public_api.ts');
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const names = [];
  for (const match of text.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of match[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const asMatch = trimmed.match(/\bas\s+(\S+)$/);
      names.push(asMatch ? asMatch[1] : trimmed);
    }
  }
  return names;
}

function importSpecifier(moduleDir, analysis) {
  const names = [...analysis.components.map((c) => c.name), ...analysis.services.map((s) => s.name)];
  if (names.length) return `{ ${names.join(', ')} }`;
  const fallback = publicApiNamedExports(moduleDir);
  if (fallback.length) return `{ ${fallback.join(', ')} }`;
  return undefined;
}

// Table cells are delimited by "|" and inline code spans don't shield it from the
// table parser, so pipes (union types) and angle brackets (generics) must be escaped.
function escapeCell(text) {
  return text.replaceAll('|', '\\|').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderInputsTable(inputs) {
  if (!inputs.length) return '';
  const rows = inputs.map(
    (i) =>
      `| \`${i.name}\` | \`${escapeCell(i.type)}\` | ${i.default !== undefined ? `\`${escapeCell(i.default)}\`` : '—'} | ${i.description ? escapeCell(i.description) : '—'} |`,
  );
  return ['#### Inputs', '', '| Name | Type | Default | Description |', '| --- | --- | --- | --- |', ...rows, ''].join('\n');
}

function renderOutputsTable(outputs) {
  if (!outputs.length) return '';
  const rows = outputs.map((o) => `| \`${o.name}\` | \`${escapeCell(o.type)}\` | ${o.description ? escapeCell(o.description) : '—'} |`);
  return ['#### Outputs', '', '| Name | Type | Description |', '| --- | --- | --- |', ...rows, ''].join('\n');
}

function renderModule(moduleDir, analysis, primary) {
  const title = moduleTitle(moduleDir, primary);
  const description = primary?.description || INFRA_DESCRIPTIONS[moduleDir] || '';
  const importNames = importSpecifier(moduleDir, analysis);
  const importLine = importNames ? `import ${importNames} from '@helix-ui/core/${moduleDir}';` : `import '@helix-ui/core/${moduleDir}';`;
  const sections = [`# ${title}`, '', `> ${description}`, '', '## Import', '', '```ts', importLine, '```', ''];

  if (analysis.components.length) {
    const hasComponents = analysis.components.some((c) => c.kind === 'component');
    sections.push(hasComponents ? '## Components' : '## Directives', '');
    for (const c of analysis.components) {
      sections.push(`### ${c.name}`, '', `Selector: \`${c.selector ?? '—'}\``, '');
      if (c.description) sections.push(c.description, '');
      const inputsBlock = renderInputsTable(c.inputs);
      const outputsBlock = renderOutputsTable(c.outputs);
      if (inputsBlock) sections.push(inputsBlock);
      if (outputsBlock) sections.push(outputsBlock);
    }
  }

  if (analysis.services.length) {
    sections.push('## Services', '');
    for (const s of analysis.services) {
      sections.push(`### ${s.name}`, '');
      if (s.description) sections.push(s.description, '');
    }
  }

  if (analysis.functions.length) {
    sections.push('## Functions', '');
    for (const f of analysis.functions) {
      sections.push(`- \`${f.name}\`${f.description ? ` — ${f.description}` : ''}`);
    }
    sections.push('');
  }

  if (analysis.types.length) {
    sections.push('## Interfaces & Types', '');
    for (const t of analysis.types) {
      sections.push(`- \`${t.name}\`${t.description ? ` — ${t.description}` : ''}`);
    }
    sections.push('');
  }

  sections.push('## Source', '', `[\`projects/core/${moduleDir}\`](../../projects/core/${moduleDir})`, '');
  return sections.join('\n').replace(/\n{3,}/g, '\n\n');
}

// INFRA_DESCRIPTIONS also doubles as the canonical list of infrastructure modules:
// several (api, config, dynamicdialog...) also declare @Component/@Directive classes,
// but are grab-bag support modules rather than showcased UI building blocks.
function classifyModule(moduleDir, analysis) {
  if (moduleDir in INFRA_DESCRIPTIONS) return 'Infrastructure';
  if (analysis.components.some((c) => c.kind === 'component')) return 'Components';
  if (analysis.components.some((c) => c.kind === 'directive')) return 'Directives';
  return 'Infrastructure';
}

function renderReadme(entries) {
  const groups = { Components: [], Directives: [], Infrastructure: [] };
  for (const entry of entries) groups[entry.group].push(entry);
  for (const group of Object.values(groups)) group.sort((a, b) => a.title.localeCompare(b.title));

  const lines = [
    '# @helix-ui/core — Module Documentation',
    '',
    'One page per entry point of `@helix-ui/core`. Import paths follow the pattern',
    "`@helix-ui/core/<module>`; all selectors use the `h-` prefix.",
    '',
    'Pages are generated from the module sources (JSDoc, selectors, inputs/outputs) using the shared',
    'structure in [_TEMPLATE.md](_TEMPLATE.md). Regenerate with `pnpm docs:components`.',
    '',
    "Output convention: signal outputs are documented as `output<T>()`, matching the source call — not",
    '`EventEmitter<T>` (the pre-signal-migration convention).',
    '',
  ];
  for (const [group, list] of Object.entries(groups)) {
    lines.push(`## ${group} (${list.length})`, '', '| Module | Description |', '| --- | --- |');
    for (const entry of list) lines.push(`| [${entry.title}](${entry.file}) | ${entry.description} |`);
    lines.push('');
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function main() {
  const program = buildProgram();
  const readmeEntries = [];
  for (const moduleDir of listModuleDirs()) {
    const analysis = analyzeModule(program, moduleDir);
    const primary = findPrimaryDeclaration(moduleDir, analysis);
    const markdown = renderModule(moduleDir, analysis, primary);
    fs.writeFileSync(path.join(DOCS_DIR, `${moduleDir}.md`), markdown.endsWith('\n') ? markdown : `${markdown}\n`);
    readmeEntries.push({
      title: moduleTitle(moduleDir, primary),
      file: `${moduleDir}.md`,
      description: primary?.description || INFRA_DESCRIPTIONS[moduleDir] || '',
      group: classifyModule(moduleDir, analysis),
    });
  }
  fs.writeFileSync(path.join(DOCS_DIR, 'README.md'), renderReadme(readmeEntries));
  console.log(`Generated ${readmeEntries.length} module docs into ${path.relative(ROOT, DOCS_DIR)}/`);
}

main();
