// The token resolver of Helix (#648): turns the token data of projects/tokens into the `--h-*` CSS variables and
// the JSON the docs site, the Design System and helix-ui read, without the styling engine of helix-core.
//
//   const { css, json } = resolveTokens(helixTokens, { darkSelector: '.app-dark', components: true });
//
// It reproduces what the engine emitted for the Helix preset, byte for byte (scripts/tests/fixtures holds the
// proof until helix-core is gone). The rules, in the words of the data model of projects/tokens/README.md:
//
//  - Name:   `--h-` + the path of the token in kebab case. The structural keys `primitive`, `semantic`,
//            `components`, `colorScheme`, `light`, `dark` and `root` are not part of the name
//            (`components.button.primary.hoverBackground` → `--h-button-primary-hover-background`).
//  - Value:  a string or number, written as it is, except `{a.b}` references: they become `var(--h-a-b)`
//            (`{border.radius.md}` → `var(--h-border-radius-md)`). A value that is a sum, difference, product or
//            quotient of numbers and references is wrapped in `calc()`.
//  - Order:  the variables of an object come in the order of its keys, **then its nested objects, last one first**
//            (the engine walks with a stack); a layer is light first (`:root,:host`), dark after it.
//  - Layers: primitive; semantic (light = everything but `colorScheme`, plus `colorScheme.light`; dark =
//            `colorScheme.dark`); global (`color-scheme: light|dark`); then one block per component.
//  - Dark:   under the dark selector: a class (`.app-dark`), or an attribute (`[data-theme="dark"]`, on the root).
//
// Pure functions, no I/O.

const PREFIX = 'h';
const LIGHT_SELECTOR = ':root,:host';
/** Keys that structure the data but are not part of a token's name. */
const STRUCTURE = /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/i;
const REFERENCE = /{([^}]*)}/g;
const CALC = /(\d+\s+[+\-*/]\s+\d+)/;

const isObject = (value) => value instanceof Object && value.constructor === Object;
const isEmpty = (value) => value === undefined || value === null || value === '' || (isObject(value) && Object.keys(value).length === 0);

/** `hoverBackground` → `hover-background`, `some_key` → `some-key`. */
export function kebab(text) {
  return text.replace(/_/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/** The custom property of a path (without the prefix): `['button', 'primary', 'hoverBackground']`. */
export function variableName(path) {
  const parts = path.filter((key) => !STRUCTURE.test(key)).map(kebab);
  return `--${[PREFIX, ...parts].join('-').replace(/ /g, '').replace(/[^\w]/g, '-')}`;
}

/** The value of a token: references become `var()`, arithmetic on them `calc()`. */
export function variableValue(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  const braces = (text.match(/{/g) ?? []).length + (text.match(/}/g) ?? []).length;
  if (braces % 2 !== 0) return undefined;
  if (!REFERENCE.test(text)) return text;
  REFERENCE.lastIndex = 0;
  const resolved = text.replaceAll(REFERENCE, (match) => {
    const keys = match.replace(/[{}]/g, '').split('.').filter((key) => !STRUCTURE.test(key));
    return `var(${variableName(keys)})`;
  });
  return CALC.test(resolved.replace(/var\([^)]+\)/g, '0')) ? `calc(${resolved})` : resolved;
}

/** The `--name:value;` declarations of a tree, in the order of the engine (see the header). */
export function declare(tree, prefixPath = []) {
  const declarations = [];
  const stack = [{ node: tree, path: prefixPath }];
  while (stack.length) {
    const { node, path } = stack.pop();
    for (const key of Object.keys(node)) {
      const value = node[key];
      if (isObject(value)) stack.push({ node: value, path: [...path, key] });
      else declarations.push({ name: variableName([...path, key]), value: variableValue(value) });
    }
  }
  return declarations;
}

const text = (declarations) => declarations.map(({ name, value }) => `${name}:${value};`).join('');

/**
 * The rule of the dark scheme: a class selector (`.app-dark`) is used as it is; an attribute selector
 * (`[data-theme="dark"]`) applies to the root element, `:root[…],:host[…]`.
 */
function darkRule(css, darkSelector) {
  if (/^\.[a-zA-Z][\w-]*$/.test(darkSelector)) return `${darkSelector}{${css}}`;
  if (/^\[.+\]$/.test(darkSelector)) return `:root${darkSelector},:host${darkSelector}{${css}}`;
  throw new Error(`dark selector "${darkSelector}": only a class (".app-dark") or an attribute ("[data-theme=dark]") selector is supported`);
}

const rule = (selector, css) => (css ? `${selector}{${css}}` : '');

/** Light then dark rule of the declarations of a block. */
function block(light, dark, darkSelector) {
  return `${rule(LIGHT_SELECTOR, light)}${dark ? darkRule(dark, darkSelector) : ''}`;
}

/**
 * The CSS of the three base layers: primitive, semantic, global.
 * `data` is `{ primitive, semantic, components }`.
 */
function baseCss(data, darkSelector) {
  const { colorScheme, ...semanticRest } = data.semantic ?? {};
  const { dark, ...lightScheme } = colorScheme ?? {};
  const primitive = isEmpty(data.primitive) ? '' : text(declare({ primitive: data.primitive }));
  const semanticLight =
    (isEmpty(semanticRest) ? '' : text(declare({ semantic: semanticRest }))) +
    (isEmpty(lightScheme) ? '' : text(declare({ light: lightScheme })));
  const semanticDark = isEmpty(dark) ? '' : text(declare({ dark }));
  return [
    rule(LIGHT_SELECTOR, primitive),
    block(semanticLight, semanticDark, darkSelector),
    block('color-scheme:light', 'color-scheme:dark', darkSelector),
  ].filter(Boolean);
}

/** The CSS of one component: its variables (light), then its dark variables. */
function componentCss(name, set, darkSelector) {
  const { colorScheme, extend, css, ...rest } = set;
  const { dark, ...lightScheme } = colorScheme ?? {};
  const light =
    (isEmpty(rest) ? '' : text(declare({ [name]: rest }))) +
    (isEmpty(lightScheme) ? '' : text(declare({ [name]: lightScheme })));
  const darkText = isEmpty(dark) ? '' : text(declare({ [name]: dark }));
  return block(light, darkText, darkSelector);
}

/** The tokens of a CSS text by colour scheme: a declaration inside the dark selector is dark, the rest light. */
export function tokensOf(css, darkSelector) {
  const tokens = { light: {}, dark: {} };
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const scheme = selector.includes(darkSelector) ? 'dark' : 'light';
    for (const [, name, value] of body.matchAll(/(--h-[\w-]+)\s*:\s*([^;]+)/g)) tokens[scheme][name] = value.trim();
  }
  return tokens;
}

/**
 * Resolves token data to CSS and JSON.
 *
 * @param data `{ primitive, semantic, components }` (see projects/tokens)
 * @param options.darkSelector class selector of the dark scheme, default `.app-dark`
 * @param options.components `true` for every component set (the default), `false` for the base layers only, or
 *        an array of component names for just those, in that order
 * @returns `css` as the engine's `resolvePreset` wrote it (blocks joined by a newline) and `json`, the variables by
 *          colour scheme
 */
export function resolveTokens(data, { darkSelector = '.app-dark', components = true } = {}) {
  const parts = baseCss(data, darkSelector);
  if (components) {
    const sets = data.components ?? {};
    const names = Array.isArray(components) ? components : Object.keys(sets).sort();
    for (const name of names) {
      if (!sets[name]) throw new Error(`no component token set "${name}"`);
      parts.push(componentCss(name, sets[name], darkSelector));
    }
  }
  const css = parts.filter(Boolean).join('\n');
  return { css, json: tokensOf(css, darkSelector) };
}
