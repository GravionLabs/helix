// helix/no-raw-control (ADR 0008, ADR 0009): a raw control in an Angular template needs a Helix directive, or has to
// be replaced by a Helix component. Runs on the AST of @angular-eslint/template-parser.

/**
 * The Helix carriers per raw element: `directives` (one of them on the element makes it pass) or `component` (the raw
 * element is always reported). scripts/tests/lint-preset-template.spec.ts checks them against the helix-ui selectors.
 */
export const HELIX_CONTROLS = Object.freeze({
  button: { directives: ['hx-button', 'hx-list-row'] },
  input: { directives: ['hx-input', 'hx-checkbox', 'hx-radio', 'hx-switch'] },
  textarea: { directives: ['hx-input'] },
  select: { component: 'hx-select' },
  progress: { component: 'hx-progress-bar' },
});

/** The component whose own `<input type="file">` is not reported. */
export const FILE_UPLOAD = 'hx-file-upload';

const list = (names) => names.map((name) => `\`${name}\``).join(' or ');

/** The value of the static attribute `name`, lower case; `undefined` when the element has none. */
const staticValue = (node, name) =>
  node.attributes.find((attribute) => attribute.name === name)?.value.toLowerCase();

/** Angular matches an attribute selector against static attributes and property bindings. */
const hasDirective = (node, directives) =>
  [...node.attributes, ...node.inputs].some(({ name }) => directives.includes(name));

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow raw controls without a Helix directive in Angular templates' },
    schema: [],
    messages: {
      directive: 'Raw `<{{element}}>`: add the Helix directive {{directives}}.',
      component: 'Raw `<{{element}}>`: use `<{{component}}>` instead.',
    },
  },
  create(context) {
    const insideFileUpload = (node) =>
      context.sourceCode.getAncestors(node).some((ancestor) => ancestor.name === FILE_UPLOAD);

    return {
      Element(node) {
        const element = node.name;
        if (!Object.hasOwn(HELIX_CONTROLS, element)) return;
        const { directives, component } = HELIX_CONTROLS[element];
        const loc = context.sourceCode.parserServices.convertElementSourceSpanToLoc(context, node);
        if (component) {
          context.report({ loc, messageId: 'component', data: { element, component } });
          return;
        }
        if (element === 'input') {
          const type = staticValue(node, 'type');
          if (type === 'hidden' || (type === 'file' && insideFileUpload(node))) return;
        }
        if (hasDirective(node, directives)) return;
        context.report({
          loc,
          messageId: 'directive',
          data: { element, directives: list(directives) },
        });
      },
    };
  },
};
