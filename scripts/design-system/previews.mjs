// The component previews of the Design System (#528): static renditions of Helix components.
//
// Helix components are Angular, the Design System type's runtime is React, so there is no bundle.js: each
// preview is the markup the component renders (captured from the demo, stripped of Angular's bookkeeping
// attributes), styled by the component's real structural CSS and the resolved `--h-*` tokens in
// `components/bundle.css`. `bundle.mjs` composes the files; a test fails when a preview uses a class that
// bundle.css does not define.

const icon = (d, cls = '') =>
  `<svg class="${cls}" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const PLUS = icon('<path d="M12 5v14M5 12h14"/>', 'h-button-icon');
const CHECK = icon('<path d="m5 12 5 5L20 7"/>', 'h-button-icon h-button-icon-left');
const CHECK_MARK = icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'h-checkbox-icon');
const BOOKMARK = icon('<path d="M6 4h12v17l-6-4-6 4z"/>', 'h-button-icon h-button-icon-left');

const btn = (label, cls = '') => `<button class="h-button h-component ${cls}" type="button"><span class="h-button-label">${label}</span></button>`;
const SEVERITIES = ['secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const row = (html) => `<div class="row">${html}</div>`;

/** Previews in display order. `css` lists the component directories whose structural CSS the preview needs. */
export const PREVIEWS = [
  {
    name: 'Button',
    group: 'Actions',
    height: 230,
    css: ['button', 'badge'],
    selector: 'h-button / hButton',
    entry: '@gravionlabs/helix-core/button',
    summary: 'Button triggers an action; severity, variant and size say how loud it is.',
    guidelines: [
      'Use **primary** for the one main action of a view, **secondary** (a quiet neutral) for the rest, **text** and **link** for tertiary actions in dense UI.',
      'Severities carry meaning, not decoration: **success** confirms, **info** informs, **warn** needs attention, **danger** destroys or is irreversible, **help** points to guidance, **contrast** is the strongest neutral (near-black in light, white in dark).',
      'Variants: filled (default), `outlined`, `text`, `raised` (adds a shadow), `rounded` (pill). Sizes: `small`, default, `large`. An icon-only button needs an `aria-label`.',
      'Text on severity fills can fall below 4.5:1 for small text (see the `on-<severity>` tokens); keep labels short and weight 500.',
    ],
    tokens: 'Tokens: `primary`, `primary-hover`, `primary-contrast`, `secondary`, `success`, `info`, `warn`, `help`, `danger`, `contrast`, `radius-md`, `field-padding-x/y`.',
    body: [
      row(['primary', ...SEVERITIES].map((s) => btn(cap(s), s === 'primary' ? '' : `h-button-${s}`)).join('')),
      row(['primary', ...SEVERITIES.slice(0, 5)].map((s) => btn(cap(s), `h-button-outlined ${s === 'primary' ? '' : `h-button-${s}`}`)).join('')),
      row(['primary', ...SEVERITIES.slice(0, 5)].map((s) => btn(cap(s), `h-button-text ${s === 'primary' ? '' : `h-button-${s}`}`)).join('')),
      row(
        [
          btn('Small', 'h-button-sm'),
          btn('Default'),
          btn('Large', 'h-button-lg'),
          btn('Rounded', 'h-button-rounded'),
          btn('Raised', 'h-button-raised h-button-secondary'),
          `<button class="h-button h-component" type="button">${BOOKMARK}<span class="h-button-label">Bookmark</span></button>`,
          `<button class="h-button h-component h-button-icon-only" type="button" aria-label="Add">${PLUS}</button>`,
          `<button class="h-button h-component" type="button" disabled data-h-disabled="true"><span class="h-button-label">Disabled</span></button>`,
        ].join(''),
      ),
    ].join(''),
  },
  {
    name: 'InputText',
    group: 'Form',
    height: 250,
    css: ['inputtext'],
    selector: 'input[hInputText]',
    entry: '@gravionlabs/helix-core/inputtext',
    summary: 'InputText is the single-line text field, with a visible label and three states.',
    guidelines: [
      'Always pair a field with a visible `<label>`; the placeholder is a hint, not a label (it is `field-placeholder`, 4.5:1 on `field-bg` is not guaranteed).',
      'The focus state swaps the border for `field-border-focus` (the primary colour) — keep it visible; do not remove the outline without a replacement.',
      'Mark an invalid field with `h-invalid` (border `field-border-invalid`) **and** a message below it; colour alone is not enough.',
      'Variants: default (outlined), `h-variant-filled`; sizes `h-inputtext-sm`, `h-inputtext-lg`; `h-inputtext-fluid` fills its container.',
    ],
    tokens: 'Tokens: `field-bg`, `field-border`, `field-border-hover`, `field-border-focus`, `field-border-invalid`, `field-placeholder`, `text`, `radius-md`, `field-padding-x/y`.',
    body: `<div class="stack" style="max-width:320px">
  <label class="field"><span>Username</span><input type="text" placeholder="Default" class="h-component h-inputtext"></label>
  <label class="field"><span>Filled</span><input type="text" value="jkaufmann" class="h-component h-inputtext h-variant-filled"></label>
  <label class="field"><span>Disabled</span><input type="text" value="Read only" disabled class="h-component h-inputtext"></label>
  <label class="field"><span>Invalid</span><input type="text" value="x" class="h-component h-inputtext h-invalid"><small class="msg">Username must have at least 3 characters.</small></label>
</div>`,
  },
  {
    name: 'Textarea',
    group: 'Form',
    height: 150,
    css: ['textarea'],
    selector: 'textarea[hTextarea]',
    entry: '@gravionlabs/helix-core/textarea',
    summary: 'Textarea is the multi-line text field; it looks and behaves like InputText.',
    guidelines: ['Use for free text longer than a line; set a sensible `rows`.', 'Shares every field token with InputText; `h-textarea-resizable` allows the user to resize vertically.'],
    tokens: 'Tokens: as InputText.',
    body: `<div class="stack" style="max-width:360px"><label class="field"><span>Message</span><textarea placeholder="Your message" rows="3" class="h-component h-textarea h-textarea-resizable"></textarea></label></div>`,
  },
  {
    name: 'Checkbox',
    group: 'Form',
    height: 70,
    css: ['checkbox'],
    selector: 'h-checkbox',
    entry: '@gravionlabs/helix-core/checkbox',
    summary: 'Checkbox toggles one option on or off, or selects any number from a group.',
    guidelines: ['Label every checkbox with a clickable `<label>` next to it.', 'Use a toggle switch for a setting that applies immediately; a checkbox for choices submitted later.'],
    tokens: 'Tokens: `primary` (checked fill), `primary-contrast` (the tick), `field-border`, `field-bg`, `radius-xs`.',
    body: row(
      `<label class="inline"><h-checkbox class="h-checkbox h-component"><input type="checkbox" class="h-checkbox-input"><div class="h-checkbox-box"></div></h-checkbox> Unchecked</label>` +
        `<label class="inline"><h-checkbox class="h-checkbox h-component h-checkbox-checked h-highlight"><input type="checkbox" class="h-checkbox-input" checked><div class="h-checkbox-box">${CHECK_MARK}</div></h-checkbox> Checked</label>` +
        `<label class="inline"><h-checkbox class="h-checkbox h-component h-disabled"><input type="checkbox" class="h-checkbox-input" disabled><div class="h-checkbox-box"></div></h-checkbox> Disabled</label>` +
        `<label class="inline"><h-checkbox class="h-checkbox h-component h-invalid"><input type="checkbox" class="h-checkbox-input"><div class="h-checkbox-box"></div></h-checkbox> Invalid</label>`,
    ),
  },
  {
    name: 'RadioButton',
    group: 'Form',
    height: 70,
    css: ['radiobutton'],
    selector: 'h-radiobutton',
    entry: '@gravionlabs/helix-core/radiobutton',
    summary: 'RadioButton selects exactly one option from a short list.',
    guidelines: ['Use for two to five mutually exclusive options; a select for more.', 'Group the radios under a fieldset legend; one of them is preselected unless "none" is a valid answer.'],
    tokens: 'Tokens: as Checkbox.',
    body: row(
      `<label class="inline"><h-radiobutton class="h-component h-radiobutton"><input type="radio" class="h-radiobutton-input" name="r"><div class="h-radiobutton-box"><div class="h-radiobutton-icon"></div></div></h-radiobutton> Off</label>` +
        `<label class="inline"><h-radiobutton class="h-component h-radiobutton h-radiobutton-checked"><input type="radio" class="h-radiobutton-input" name="r" checked><div class="h-radiobutton-box"><div class="h-radiobutton-icon"></div></div></h-radiobutton> On</label>` +
        `<label class="inline"><h-radiobutton class="h-component h-radiobutton h-disabled"><input type="radio" class="h-radiobutton-input" disabled><div class="h-radiobutton-box"><div class="h-radiobutton-icon"></div></div></h-radiobutton> Disabled</label>`,
    ),
  },
  {
    name: 'ToggleSwitch',
    group: 'Form',
    height: 70,
    css: ['toggleswitch'],
    selector: 'h-toggleswitch',
    entry: '@gravionlabs/helix-core/toggleswitch',
    summary: 'ToggleSwitch turns a setting on or off immediately.',
    guidelines: ['Use for settings that take effect at once (dark mode, notifications); never for a choice that needs a Save.', 'The label states the setting, not the action: "Dark mode", not "Toggle dark mode".'],
    tokens: 'Tokens: `primary` (on track), `surface-0` (handle), `field-border`.',
    body: row(
      `<label class="inline"><h-toggleswitch class="h-component h-toggleswitch"><input type="checkbox" role="switch" class="h-toggleswitch-input"><div class="h-toggleswitch-slider"><div class="h-toggleswitch-handle"></div></div></h-toggleswitch> Off</label>` +
        `<label class="inline"><h-toggleswitch class="h-component h-toggleswitch h-toggleswitch-checked"><input type="checkbox" role="switch" class="h-toggleswitch-input" checked><div class="h-toggleswitch-slider"><div class="h-toggleswitch-handle"></div></div></h-toggleswitch> On</label>` +
        `<label class="inline"><h-toggleswitch class="h-component h-toggleswitch h-disabled"><input type="checkbox" role="switch" class="h-toggleswitch-input" disabled><div class="h-toggleswitch-slider"><div class="h-toggleswitch-handle"></div></div></h-toggleswitch> Disabled</label>`,
    ),
  },
  {
    name: 'Tag',
    group: 'Data display',
    height: 100,
    css: ['tag'],
    selector: 'h-tag',
    entry: '@gravionlabs/helix-core/tag',
    summary: 'Tag labels an item with a short status or category.',
    guidelines: ['Keep to one or two words; a tag describes, it is not clickable (use a chip for removable or selectable values).', 'Severity follows the same meaning as buttons; do not use colour as the only carrier of the status.'],
    tokens: 'Tokens: severity fills (`success`, `info`, `warn`, `danger`, `secondary`, `contrast`) and `on-<severity>` text, `primary`.',
    body: row(['', ...['success', 'info', 'warn', 'danger', 'secondary', 'contrast']].map((s) => `<h-tag class="h-component h-tag${s ? ` h-tag-${s}` : ''}"><span class="h-tag-label">${cap(s || 'primary')}</span></h-tag>`).join('')) +
      row(['', ...['success', 'info', 'warn', 'danger']].map((s) => `<h-tag class="h-component h-tag h-tag-rounded${s ? ` h-tag-${s}` : ''}"><span class="h-tag-label">${cap(s || 'primary')}</span></h-tag>`).join('')),
  },
  {
    name: 'Badge',
    group: 'Data display',
    height: 80,
    css: ['badge'],
    selector: 'h-badge',
    entry: '@gravionlabs/helix-core/badge',
    summary: 'Badge shows a count or a status dot, usually on another element.',
    guidelines: ['Counts above 99 read "99+"; a dot means "something changed" without a number.', 'Give the host element an accessible name that includes the count ("Messages, 3 unread").'],
    tokens: 'Tokens: `primary`, severity fills.',
    body: row(
      ['', 'success', 'info', 'warn', 'danger', 'secondary', 'contrast'].map((s) => `<h-badge class="h-badge h-badge-circle h-component${s ? ` h-badge-${s}` : ''}">${s ? s.length : 2}</h-badge>`).join('') +
        `<h-badge class="h-badge h-badge-dot h-component"></h-badge><h-badge class="h-badge h-badge-dot h-badge-danger h-component"></h-badge>` +
        `<h-badge class="h-badge h-component h-badge-sm">Small</h-badge><h-badge class="h-badge h-component">Default</h-badge><h-badge class="h-badge h-component h-badge-lg">Large</h-badge>`,
    ),
  },
  {
    name: 'Message',
    group: 'Feedback',
    height: 300,
    css: ['message'],
    selector: 'h-message',
    entry: '@gravionlabs/helix-core/message',
    summary: 'Message shows inline feedback next to the thing it is about.',
    guidelines: ['Use inline messages for validation and page-level status; a toast for transient confirmation.', 'Say what happened and what to do next; `error` for blocking problems, `warn` for risks, `success` for completion, `info` for neutral notes.', 'Variants: `simple` (text only), `outlined`, default (tinted fill).'],
    tokens: 'Tokens: severity colours, `radius-md`.',
    body: `<div class="stack">${['info', 'success', 'warn', 'error', 'secondary', 'contrast']
      .map((s) => `<h-message role="alert" class="h-component h-message h-message-${s}"><div class="h-message-content-wrapper"><div class="h-message-content"><span class="h-message-text">${cap(s)}: a short sentence that says what happened.</span></div></div></h-message>`)
      .join('')}<h-message role="alert" class="h-component h-message h-message-error h-message-outlined"><div class="h-message-content-wrapper"><div class="h-message-content"><span class="h-message-text">Outlined error variant.</span></div></div></h-message></div>`,
  },
  {
    name: 'Card',
    group: 'Container',
    height: 200,
    css: ['card', 'button'],
    selector: 'h-card',
    entry: '@gravionlabs/helix-core/card',
    summary: 'Card groups related content and actions on one surface.',
    guidelines: ['One card, one subject; do not nest cards.', 'The surface is `content-bg` with a `content-border` hairline and `radius-md`; a shadow is not used at rest.', 'Title in the display face, supporting text in `text-muted`; actions at the bottom, primary last.'],
    tokens: 'Tokens: `content-bg`, `content-border`, `text`, `text-muted`, `radius-md`.',
    body: `<h-card class="h-card h-component" style="max-width:380px"><div class="h-card-body"><div class="h-card-caption"><div class="h-card-title">Deploy to staging</div><div class="h-card-subtitle">Last run 12 minutes ago</div></div><div class="h-card-content"><p style="margin:0">Builds the libraries and the demo, then publishes the preview to the staging site.</p></div><div class="h-card-footer" style="display:flex;gap:.5rem;margin-top:1rem">${btn('Cancel', 'h-button-secondary')}${btn('Deploy')}</div></div></h-card>`,
  },
  {
    name: 'Divider',
    group: 'Container',
    height: 170,
    css: ['divider'],
    selector: 'h-divider',
    entry: '@gravionlabs/helix-core/divider',
    summary: 'Divider separates content with a hairline, optionally labelled.',
    guidelines: ['Prefer spacing to dividers; use one where groups need an explicit break.', 'A label ("or") sits centred by default; use `h-divider-left` or `-right` to align it.'],
    tokens: 'Tokens: `content-border`, `text-muted`.',
    body: `<div class="stack">
  <p style="margin:0">Above</p>
  <h-divider role="separator" class="h-component h-divider h-divider-horizontal h-divider-solid h-divider-left"></h-divider>
  <p style="margin:0">Between</p>
  <h-divider role="separator" class="h-component h-divider h-divider-horizontal h-divider-dashed h-divider-center"><div class="h-divider-content"><b>OR</b></div></h-divider>
  <p style="margin:0">Below</p>
</div>`,
  },
  {
    name: 'ProgressBar',
    group: 'Feedback',
    height: 130,
    css: ['progressbar'],
    selector: 'h-progressbar',
    entry: '@gravionlabs/helix-core/progressbar',
    summary: 'ProgressBar shows how far a known operation has come, or that one is running.',
    guidelines: ['Determinate when the total is known; indeterminate otherwise.', 'Announce the value to assistive technology (`role="progressbar"`, `aria-valuenow`).'],
    tokens: 'Tokens: `primary` (value), `surface-200`/`800` (track), `radius-md`.',
    body: `<div class="stack" style="max-width:360px">
  <h-progressbar role="progressbar" aria-valuemin="0" aria-valuenow="40" aria-valuemax="100" class="h-component h-progressbar h-progressbar-determinate"><div class="h-progressbar-value" style="width:40%"><div class="h-progressbar-label"><div>40%</div></div></div></h-progressbar>
  <h-progressbar role="progressbar" aria-valuemin="0" aria-valuenow="85" aria-valuemax="100" class="h-component h-progressbar h-progressbar-determinate"><div class="h-progressbar-value" style="width:85%"><div class="h-progressbar-label"><div>85%</div></div></div></h-progressbar>
  <h-progressbar role="progressbar" class="h-component h-progressbar h-progressbar-indeterminate"><div class="h-progressbar-value"></div></h-progressbar>
</div>`,
  },
];

/** Classes the components put on their markup that no CSS rule targets (state or part markers). */
export const MARKER_CLASSES = ['h-button-icon-left', 'h-highlight', 'h-tag-label', 'h-card-content', 'h-card-footer', 'h-divider-center'];

/** The classes a preview's markup uses (everything in `class="…"`). */
export function classesOf(html) {
  const set = new Set();
  for (const [, value] of html.matchAll(/class="([^"]*)"/g)) for (const c of value.split(/\s+/)) if (c) set.add(c);
  return set;
}
