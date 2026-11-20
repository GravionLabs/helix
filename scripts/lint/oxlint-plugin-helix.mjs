/**
 * helix's own oxlint rules (an oxlint JS plugin, `.oxlintrc.json` `jsPlugins`).
 *
 * `helix/no-decorator-api` (#373): the libraries are written with signals, so the decorator-based
 * Input/Output/ViewChild/ContentChild/ContentChildren/HostListener/HostBinding APIs are banned there.
 * It replaces the `no-restricted-syntax` selector of the former ESLint config (oxlint has no
 * `no-restricted-syntax`). `.oxlintrc.json` turns it on for the library sources, not for spec files,
 * whose test hosts legitimately use classic decorators.
 */
const BANNED = new Set([
  'Input',
  'Output',
  'ViewChild',
  'ContentChild',
  'ContentChildren',
  'HostListener',
  'HostBinding',
]);

const noDecoratorApi = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow the decorator-based Input/Output/Query/Host APIs.' },
    messages: {
      banned:
        '@{{name}} is banned here: use input()/model()/output()/viewChild()/contentChild()/contentChildren()/host metadata instead (#373). For a documented exception add an oxlint-disable-next-line comment with the reason.',
    },
    schema: [],
  },
  create(context) {
    return {
      Decorator(node) {
        const call = node.expression;
        if (call?.type !== 'CallExpression' || call.callee?.type !== 'Identifier') return;
        if (BANNED.has(call.callee.name)) {
          context.report({ node, messageId: 'banned', data: { name: call.callee.name } });
        }
      },
    };
  },
};

export default {
  meta: { name: 'helix' },
  rules: { 'no-decorator-api': noDecoratorApi },
};
