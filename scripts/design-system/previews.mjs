// The component previews of the Design System (#528): static renditions of Helix components.
//
// Helix components are Angular, the Design System type's runtime is React, so there is no bundle.js: each
// preview is the markup the component renders (the classes of `@gravionlabs/helix-ui`, without Angular's
// bookkeeping attributes), styled by the component's real stylesheet and the resolved `--h-*` tokens in
// `components/bundle.css`. `bundle.mjs` composes the files; a test fails when a preview uses a class that
// bundle.css does not define.

const icon = (d, cls = '') =>
  `<svg class="${cls}" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const PLUS = icon('<path d="M12 5v14M5 12h14"/>', 'hx-button-icon');
const BOOKMARK = icon('<path d="M6 4h12v17l-6-4-6 4z"/>', 'hx-button-icon');

const btn = (label, cls = '') => `<button class="hx-button ${cls}" type="button">${label}</button>`;
const SEVERITIES = ['secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const row = (html) => `<div class="row">${html}</div>`;
const sev = (prefix, s) => (s && s !== 'primary' ? ` ${prefix}-${s}` : '');

/** Previews in display order. `css` lists the stylesheets of `projects/ui/styles` the preview needs. */
export const PREVIEWS = [
  {
    name: 'Button',
    group: 'Actions',
    height: 230,
    css: ['button'],
    selector: 'button[hx-button]',
    exportName: 'HxButton',
    entry: '@gravionlabs/helix-ui',
    summary: 'Button triggers an action; severity, variant and size say how loud it is.',
    guidelines: [
      'Use **primary** for the one main action of a view, **secondary** (a quiet neutral) for the rest, **text** and **link** for tertiary actions in dense UI.',
      'Severities carry meaning, not decoration: **success** confirms, **info** informs, **warn** needs attention, **danger** destroys or is irreversible, **help** points to guidance, **contrast** is the strongest neutral (near-black in light, white in dark).',
      'Variants: `filled` (default), `outlined`, `text`, `link`; `raised` adds a shadow, `rounded` makes a pill. Sizes: `small`, `medium`, `large`. An icon-only button (`iconOnly`) needs an `aria-label`.',
      'Text on severity fills can fall below 4.5:1 for small text; keep labels short and weight 500.',
    ],
    tokens: 'Tokens: `--h-button-*` (per severity: `primary`, `secondary`, `success`, `info`, `warn`, `help`, `danger`, `contrast`; background, border, color, hover and active states, focus ring), `--h-form-field-padding-x/y`.',
    body: [
      row(['primary', ...SEVERITIES].map((s) => btn(cap(s), sev('hx-button', s).trim())).join('')),
      row(['primary', ...SEVERITIES.slice(0, 5)].map((s) => btn(cap(s), `hx-button-outlined${sev('hx-button', s)}`)).join('')),
      row(['primary', ...SEVERITIES.slice(0, 5)].map((s) => btn(cap(s), `hx-button-text${sev('hx-button', s)}`)).join('')),
      row(
        [
          btn('Small', 'hx-button-sm'),
          btn('Default'),
          btn('Large', 'hx-button-lg'),
          btn('Rounded', 'hx-button-rounded'),
          btn('Raised', 'hx-button-raised hx-button-secondary'),
          `<button class="hx-button" type="button">${BOOKMARK}Bookmark</button>`,
          `<button class="hx-button hx-button-icon-only" type="button" aria-label="Add">${PLUS}</button>`,
          `<button class="hx-button" type="button" disabled>Disabled</button>`,
        ].join(''),
      ),
    ].join(''),
  },
  {
    name: 'Input',
    group: 'Form',
    height: 250,
    css: ['input'],
    selector: 'input[hx-input]',
    exportName: 'HxInput',
    entry: '@gravionlabs/helix-ui',
    summary: 'Input is the single-line text field, with a visible label and four states.',
    guidelines: [
      'Always pair a field with a visible `<label>`; the placeholder is a hint, not a label.',
      'The focus state swaps the border for the focus border (the primary colour): keep it visible; do not remove the outline without a replacement.',
      'Mark an invalid field with `aria-invalid="true"` (or Angular `ng-invalid ng-touched`) **and** a message below it, tied with `aria-describedby`; colour alone is not enough.',
      'Variants: `outlined` (default), `filled`; sizes `small`, `medium`, `large`; `fluid` fills its container.',
    ],
    tokens: 'Tokens: `--h-inputtext-*` (background, border, hover, focus, invalid, placeholder, padding, radius).',
    body: `<div class="stack" style="max-width:320px">
  <label class="field"><span>Username</span><input type="text" placeholder="Default" class="hx-input"></label>
  <label class="field"><span>Filled</span><input type="text" value="jkaufmann" class="hx-input hx-input-filled"></label>
  <label class="field"><span>Disabled</span><input type="text" value="Read only" disabled class="hx-input"></label>
  <label class="field"><span>Invalid</span><input type="text" value="x" class="hx-input" aria-invalid="true"><small class="msg">Username must have at least 3 characters.</small></label>
</div>`,
  },
  {
    name: 'Textarea',
    group: 'Form',
    height: 150,
    css: ['input'],
    selector: 'textarea[hx-input]',
    exportName: 'HxInput',
    entry: '@gravionlabs/helix-ui',
    summary: 'Textarea is the multi-line text field; it looks and behaves like Input.',
    guidelines: ['Use for free text longer than a line; set a sensible `rows`.', 'Shares every field token with Input; `autoResize` makes the height follow the content.'],
    tokens: 'Tokens: as Input.',
    body: `<div class="stack" style="max-width:360px"><label class="field"><span>Message</span><textarea placeholder="Your message" rows="3" class="hx-input"></textarea></label></div>`,
  },
  {
    name: 'Checkbox',
    group: 'Form',
    height: 70,
    css: ['checkbox'],
    selector: 'input[hx-checkbox]',
    exportName: 'HxCheckbox',
    entry: '@gravionlabs/helix-ui',
    summary: 'Checkbox toggles one option on or off, or selects any number from a group.',
    guidelines: ['Label every checkbox with a clickable `<label>` around or next to it.', 'Use a switch for a setting that applies immediately; a checkbox for choices submitted later.', 'It is a native `<input type="checkbox">`: `indeterminate`, `disabled` and `aria-invalid` work as for any checkbox.'],
    tokens: 'Tokens: `--h-checkbox-*` (box, border, checked fill, tick, focus ring).',
    body: row(
      `<label class="inline"><input type="checkbox" class="hx-checkbox"> Unchecked</label>` +
        `<label class="inline"><input type="checkbox" class="hx-checkbox" checked> Checked</label>` +
        `<label class="inline"><input type="checkbox" class="hx-checkbox" disabled> Disabled</label>` +
        `<label class="inline"><input type="checkbox" class="hx-checkbox" aria-invalid="true"> Invalid</label>`,
    ),
  },
  {
    name: 'Radio',
    group: 'Form',
    height: 70,
    css: ['radio'],
    selector: 'input[hx-radio]',
    exportName: 'HxRadio',
    entry: '@gravionlabs/helix-ui',
    summary: 'Radio selects exactly one option from a short list.',
    guidelines: ['Use for two to five mutually exclusive options; a select for more.', 'Group the radios under a fieldset legend; one of them is preselected unless "none" is a valid answer.'],
    tokens: 'Tokens: `--h-radiobutton-*`.',
    body: row(
      `<label class="inline"><input type="radio" class="hx-radio" name="r"> Off</label>` +
        `<label class="inline"><input type="radio" class="hx-radio" name="r" checked> On</label>` +
        `<label class="inline"><input type="radio" class="hx-radio" disabled> Disabled</label>`,
    ),
  },
  {
    name: 'Switch',
    group: 'Form',
    height: 70,
    css: ['switch'],
    selector: 'input[hx-switch]',
    exportName: 'HxSwitch',
    entry: '@gravionlabs/helix-ui',
    summary: 'Switch turns a setting on or off immediately.',
    guidelines: ['Use for settings that take effect at once (dark mode, notifications); never for a choice that needs a Save.', 'The label states the setting, not the action: "Dark mode", not "Toggle dark mode".', 'It is a native checkbox with `role="switch"`: keyboard and screen readers work as for a checkbox.'],
    tokens: 'Tokens: `--h-toggleswitch-*`.',
    body: row(
      `<label class="inline"><input type="checkbox" role="switch" class="hx-switch"> Off</label>` +
        `<label class="inline"><input type="checkbox" role="switch" class="hx-switch" checked> On</label>` +
        `<label class="inline"><input type="checkbox" role="switch" class="hx-switch" disabled> Disabled</label>`,
    ),
  },
  {
    name: 'Tag',
    group: 'Data display',
    height: 100,
    css: ['tag'],
    selector: 'hx-tag',
    exportName: 'HxTag',
    entry: '@gravionlabs/helix-ui',
    summary: 'Tag labels an item with a short status or category.',
    guidelines: ['Keep to one or two words; a tag describes, it is not clickable (use a chip for removable values).', 'Severity follows the same meaning as buttons; do not use colour as the only carrier of the status.'],
    tokens: 'Tokens: `--h-tag-*` (per severity: background and color; font, padding, radius).',
    body: row(['primary', 'success', 'info', 'warn', 'danger', 'secondary', 'contrast'].map((s) => `<span class="hx-tag${sev('hx-tag', s)}">${cap(s)}</span>`).join('')) +
      row(['primary', 'success', 'info', 'warn', 'danger'].map((s) => `<span class="hx-tag hx-tag-rounded${sev('hx-tag', s)}">${cap(s)}</span>`).join('')),
  },
  {
    name: 'Badge',
    group: 'Data display',
    height: 80,
    css: ['badge'],
    selector: 'hx-badge',
    exportName: 'HxBadge',
    entry: '@gravionlabs/helix-ui',
    summary: 'Badge shows a count or a status dot, usually on another element.',
    guidelines: ['Counts above 99 read "99+"; a dot means "something changed" without a number.', 'Give the host element an accessible name that includes the count ("Messages, 3 unread").'],
    tokens: 'Tokens: `--h-badge-*` (per severity: background and color; sizes), `--h-overlaybadge-*`.',
    body: row(
      ['primary', 'success', 'info', 'warn', 'danger', 'secondary', 'contrast'].map((s, i) => `<span class="hx-badge${sev('hx-badge', s)}">${i + 1}</span>`).join('') +
        `<span class="hx-badge hx-badge-dot"></span><span class="hx-badge hx-badge-dot hx-badge-danger"></span>` +
        `<span class="hx-badge hx-badge-sm">Small</span><span class="hx-badge">Default</span><span class="hx-badge hx-badge-lg">Large</span>`,
    ),
  },
  {
    name: 'Message',
    group: 'Feedback',
    height: 300,
    css: ['message'],
    selector: 'hx-message',
    exportName: 'HxMessage',
    entry: '@gravionlabs/helix-ui',
    summary: 'Message shows inline feedback next to the thing it is about.',
    guidelines: ['Use inline messages for validation and page-level status; a toast for transient confirmation.', 'Say what happened and what to do next; `error` for blocking problems, `warn` for risks, `success` for completion, `info` for neutral notes.', 'Variants: `simple` (text only), `outlined`, `filled` (default).'],
    tokens: 'Tokens: `--h-message-*` (per severity, per variant: background, border, color).',
    body: `<div class="stack">${['info', 'success', 'warn', 'error', 'secondary', 'contrast']
      .map((s) => `<div role="alert" class="hx-message hx-message-${s}"><div class="hx-message-content"><span class="hx-message-icon" aria-hidden="true"></span><span class="hx-message-text">${cap(s)}: a short sentence that says what happened.</span></div></div>`)
      .join('')}<div role="alert" class="hx-message hx-message-error hx-message-outlined"><div class="hx-message-content"><span class="hx-message-icon" aria-hidden="true"></span><span class="hx-message-text">Outlined error variant.</span></div></div></div>`,
  },
  {
    name: 'Card',
    group: 'Container',
    height: 200,
    css: ['card', 'button'],
    selector: 'hx-card',
    exportName: 'HxCard',
    entry: '@gravionlabs/helix-ui',
    summary: 'Card groups related content and actions on one surface.',
    guidelines: ['One card, one subject; do not nest cards.', 'The surface is the content background with a hairline border and the content radius; a shadow is not used at rest.', 'The title is a real heading (`headingLevel`); supporting text in the muted colour; actions in the footer, primary last.'],
    tokens: 'Tokens: `--h-card-*` (background, color, border, radius, shadow, body padding, gap, title, subtitle).',
    body: `<div class="hx-card" style="max-width:380px"><div class="hx-card-body"><div class="hx-card-caption"><h3 class="hx-card-title">Deploy to staging</h3><div class="hx-card-subtitle">Last run 12 minutes ago</div></div><div class="hx-card-content"><p style="margin:0">Builds the libraries and the demo, then publishes the preview to the staging site.</p></div><div class="hx-card-footer" style="display:flex;gap:.5rem;margin-top:1rem">${btn('Cancel', 'hx-button-secondary')}${btn('Deploy')}</div></div></div>`,
  },
  {
    name: 'Divider',
    group: 'Container',
    height: 170,
    css: ['divider'],
    selector: 'hx-divider',
    exportName: 'HxDivider',
    entry: '@gravionlabs/helix-ui',
    summary: 'Divider separates content with a hairline, optionally labelled.',
    guidelines: ['Prefer spacing to dividers; use one where groups need an explicit break.', 'A label ("or") sits centred by default; use `align` to move it to the start or the end.'],
    tokens: 'Tokens: `--h-divider-*` (border color, content padding).',
    body: `<div class="stack">
  <p style="margin:0">Above</p>
  <div role="separator" class="hx-divider hx-divider-horizontal"></div>
  <p style="margin:0">Between</p>
  <div role="separator" class="hx-divider hx-divider-horizontal hx-divider-dashed hx-divider-center"><b>OR</b></div>
  <p style="margin:0">Below</p>
</div>`,
  },
  {
    name: 'ProgressBar',
    group: 'Feedback',
    height: 130,
    css: ['progress'],
    selector: 'hx-progress-bar',
    exportName: 'HxProgressBar',
    entry: '@gravionlabs/helix-ui',
    summary: 'ProgressBar shows how far a known operation has come, or that one is running.',
    guidelines: ['Determinate when the total is known; indeterminate otherwise.', 'Name it (`ariaLabel`) and announce the value to assistive technology (`role="progressbar"`, `aria-valuenow`).'],
    tokens: 'Tokens: `--h-progressbar-*` (track, value, label, height, radius).',
    body: `<div class="stack" style="max-width:360px">
  <div role="progressbar" aria-label="Upload" aria-valuemin="0" aria-valuenow="40" aria-valuemax="100" class="hx-progress-bar"><div class="hx-progress-bar-value" style="width:40%"><span class="hx-progress-bar-label">40%</span></div></div>
  <div role="progressbar" aria-label="Install" aria-valuemin="0" aria-valuenow="85" aria-valuemax="100" class="hx-progress-bar"><div class="hx-progress-bar-value" style="width:85%"><span class="hx-progress-bar-label">85%</span></div></div>
  <div role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100" class="hx-progress-bar hx-progress-bar-indeterminate"><div class="hx-progress-bar-value"></div></div>
</div>`,
  },
];

/** Classes the components put on their markup that no CSS rule targets (state or part markers). */
export const MARKER_CLASSES = ['hx-card-content', 'hx-card-footer', 'hx-divider-center', 'hx-message-icon', 'hx-message-text'];

/** The classes a preview's markup uses (everything in `class="…"`). */
export function classesOf(html) {
  const set = new Set();
  for (const [, value] of html.matchAll(/class="([^"]*)"/g)) for (const c of value.split(/\s+/)) if (c) set.add(c);
  return set;
}
