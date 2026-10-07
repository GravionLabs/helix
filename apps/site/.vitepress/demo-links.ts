/**
 * The demo page (a route under `/uikit/`, see `UIKIT_MENU_ITEMS` of the demo) that shows each component
 * page of `docs/components`: `{ demo route: component pages }`. A component without an entry has no demo.
 */
export const DEMO_ROUTES: Readonly<Record<string, readonly string[]>> = {
  'uikit/input': [
    'autocomplete',
    'cascadeselect',
    'checkbox',
    'colorpicker',
    'datepicker',
    'floatlabel',
    'iconfield',
    'iftalabel',
    'inputgroup',
    'inputgroupaddon',
    'inputicon',
    'inputmask',
    'inputnumber',
    'inputotp',
    'inputtext',
    'keyfilter',
    'knob',
    'listbox',
    'multiselect',
    'password',
    'radiobutton',
    'rating',
    'select',
    'selectbutton',
    'slider',
    'textarea',
    'togglebutton',
    'toggleswitch',
    'treeselect',
  ],
  'uikit/button': ['button', 'buttongroup', 'speeddial', 'splitbutton'],
  'uikit/table': ['paginator', 'table', 'treetable'],
  'uikit/list': ['dataview', 'orderlist', 'picklist'],
  'uikit/tree': ['organizationchart', 'tree'],
  'uikit/panel': [
    'accordion',
    'card',
    'divider',
    'fieldset',
    'panel',
    'scrollpanel',
    'splitter',
    'tabs',
    'toolbar',
  ],
  'uikit/overlay': [
    'blockui',
    'confirmdialog',
    'confirmpopup',
    'dialog',
    'drawer',
    'dynamicdialog',
    'popover',
    'tooltip',
  ],
  'uikit/media': ['carousel', 'galleria', 'image', 'imagecompare'],
  'uikit/menu': [
    'breadcrumb',
    'contextmenu',
    'dock',
    'megamenu',
    'menu',
    'menubar',
    'panelmenu',
    'stepper',
    'steps',
    'tieredmenu',
  ],
  'uikit/message': ['message', 'toast'],
  'uikit/file': ['fileupload'],
  'uikit/charts': ['chart'],
  'uikit/timeline': ['timeline'],
  'uikit/misc': [
    'animateonscroll',
    'avatar',
    'avatargroup',
    'badge',
    'chip',
    'inplace',
    'metergroup',
    'overlaybadge',
    'progressbar',
    'progressspinner',
    'ripple',
    'scrolltop',
    'skeleton',
    'styleclass',
    'tag',
    'terminal',
  ],
};

/** The demo route that shows a component page (`button`), or null when there is none. */
export function demoRouteOf(component: string): string | null {
  for (const [route, components] of Object.entries(DEMO_ROUTES)) {
    if (components.includes(component)) return route;
  }
  return null;
}

/** The address of the demo page of a component under the site's `base` (`/helix/`), or null. */
export function demoLinkOf(component: string, base: string): string | null {
  const route = demoRouteOf(component);
  return route ? `${base}demo/${route}` : null;
}

interface Token {
  type: string;
  tag: string;
  content: string;
}
interface State {
  tokens: Token[];
  env: { relativePath?: string };
  Token: new (type: string, tag: string, nesting: number) => Token;
}
interface Markdown {
  core: { ruler: { push(name: string, rule: (state: State) => void): void } };
}

/**
 * Site only: under the title of a component page, "Open in the demo" links to the demo page that shows it.
 * The Markdown stays plain for GitHub, which has no demo.
 */
export function demoLinksPlugin(md: Markdown, base: string): void {
  md.core.ruler.push('helix_demo_links', (state) => {
    const page = /^components\/([^/]+)\.md$/.exec(state.env.relativePath ?? '')?.[1];
    const href = page ? demoLinkOf(page, base) : null;
    if (!href) return;
    const at = state.tokens.findIndex((t) => t.type === 'heading_close');
    if (at < 0) return;
    const block = new state.Token('html_block', '', 0);
    // A full page load (target _self): the demo is not a page of this single-page site.
    block.content = `<p class="demo-link"><a href="${href}" target="_self">Open in the demo →</a></p>\n`;
    state.tokens.splice(at + 1, 0, block);
  });
}
