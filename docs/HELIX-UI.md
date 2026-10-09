# @gravionlabs/helix-ui

Vanilla Angular components on the Helix design tokens: standalone, signal-based, plain CSS, no runtime
styling engine and no dependency on `@gravionlabs/helix-core`. It is the long-term replacement of the
vendored PrimeNG fork ([ADR 0001](adr/0001-styling-foundation.md)); components move over group by group,
starting with the ones `helix-shell` and `helix-zod` use.

## Install and styles

```bash
npm install @gravionlabs/helix-ui
```

```css
/* the components, in the `components` cascade layer */
@import "@gravionlabs/helix-ui/styles.css";
/* the tokens the components read; load them in every app */
@import "@gravionlabs/helix-ui/tokens.css";
```

- `styles.css` states the layer order Tailwind uses (`theme, base, components, utilities`) and puts the
  component CSS in `components`: an app's unlayered CSS and Tailwind's utilities win over it.
- `tokens.css` is `helixPreset` resolved by the engine of helix-core at build time: light on `:root`, dark
  under the `app-dark` class, every token the components read. **Load it in every app, also in one that
  runs `provideHelix`:** the helix-core engine emits a component's tokens only once a core component of that
  kind is on the page, so a ui Button on a page without a core `h-button` would find no `--h-button-*`.
  The static tokens reference the semantic ones (`--h-primary-color`, …), which the engine always emits, so
  a runtime change of the primary colour or the dark mode still reaches the ui components.
- **Naming:** components are elements (`<hx-select>`), simple controls are attributes on the native element
  (`<button hx-button>`, `<input hx-input>`), always kebab-case with the prefix `hx`; classes use it too.
  helix-core owns `h-`. Both read the same `--h-*`
  tokens, so a page mixes them without a visible seam.

## Components

One page per component (usage, inputs and outputs, accessibility, tokens): see the [component reference](components/README.md).

- **Buttons and actions:** [Button](components/button.md), [Button group](components/button-group.md), [Split button](components/split-button.md), [Toggle button](components/toggle-button.md), [Select button](components/select-button.md)
- **Form controls:** [Form controls](components/form-controls.md), [Float label](components/float-label.md), [Icon field](components/icon-field.md), [Input group](components/input-group.md), [Input number](components/input-number.md), [Password](components/password.md), [Select](components/select.md), [Auto complete](components/auto-complete.md), [Multi select](components/multi-select.md), [Listbox](components/listbox.md), [Date picker](components/date-picker.md), [File upload](components/file-upload.md), [Rating](components/rating.md), [Slider](components/slider.md)
- **Containers:** [Card](components/card.md), [Panel](components/panel.md), [Fieldset](components/fieldset.md), [Accordion](components/accordion.md), [Toolbar](components/toolbar.md), [Divider](components/divider.md)
- **Overlays and messages:** [Dialog](components/dialog.md), [Drawer](components/drawer.md), [Popover](components/popover.md), [Confirm](components/confirm.md), [Toast](components/toast.md), [Message](components/message.md), [Tooltip](components/tooltip.md)
- **Navigation:** [Menu](components/menu.md), [Menubar](components/menubar.md), [Tabs](components/tabs.md), [Stepper](components/stepper.md), [Breadcrumb](components/breadcrumb.md)
- **Display:** [Avatar](components/avatar.md), [Badge](components/badge.md), [Chip](components/chip.md), [Tag](components/tag.md), [Progress](components/progress.md), [Skeleton](components/skeleton.md), [Timeline](components/timeline.md)
- **Data:** [Table](components/table.md), [Tree](components/tree.md), [Chart](components/chart.md)


## Theming

`tokens.css` gives every `--h-*` token its Helix value, light and dark. The theme service changes the colour
choice while the app runs, with CSS custom properties only: no styling engine, no rebuild.

```ts
// app.config.ts
provideHxTheme({ storageKey: 'my-app-theme' })

// anywhere
readonly theme = inject(HxTheme);
theme.toggleDark();
theme.setPrimary('emerald');   // one of HX_PRIMARY_COLORS
theme.setSurface('zinc');      // one of HX_SURFACE_NAMES; null is the Helix default
```

| Member | What it does |
| --- | --- |
| `dark()`, `setDark(on)`, `toggleDark()` | Dark mode: the class `app-dark` on `<html>` (or an attribute, see `darkSelector`). |
| `primary()`, `setPrimary(name \| null)` | The primary colour: `emerald`, `green`, `lime`, `orange`, `amber`, `yellow`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, or `noir` (black on light, white on dark). `null` is the colour of the preset. |
| `surface()`, `setSurface(name \| null)` | The grey scale behind backgrounds, borders and text: `slate`, `gray`, `zinc`, `neutral`, `stone`, `soho`, `viva`, `ocean`. `null` is the Helix default. |
| `css()` | The style text of the overrides, for an app that renders it itself (server rendering). |

Options of `provideHxTheme`:

| Option | Default | |
| --- | --- | --- |
| `darkSelector` | `'.app-dark'` | A class or an attribute (`'[data-theme="dark"]'`); the selector `tokens.css` was built for. |
| `storageKey` | `null` | Remembers the choice in `localStorage` under this key; a damaged or blocked storage is ignored. |
| `dark` | the system setting | Dark mode when nothing is remembered (`prefers-color-scheme`). |
| `primary`, `surface` | `null` | The colours when nothing is remembered. |

How it works: the primary scale `--h-primary-50 … 950` is pointed at another colour scale
(`var(--h-emerald-500)`), the roles that depend on it (`--h-primary-color` is step 600 in light and 400 in dark)
stay those of the tokens, so every component follows. A surface replaces `--h-surface-0 … 950` in both colour
schemes. The overrides live in one style sheet of the service (a constructed one where the browser has them,
otherwise a `<style data-hx-theme>`), with a selector that wins over `tokens.css` in light and dark; the service
removes it when it is destroyed. Nothing touches the DOM on the server.

## Menu item model

`HxMenuItem` is the entry of every menu-like component (breadcrumb now; menu, menubar and split button follow):

```ts
import type { HxMenuItem } from '@gravionlabs/helix-ui';

const items: HxMenuItem[] = [
  { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
  { separator: true },
  { label: 'Docs', url: 'https://example.com/docs', target: '_blank' },
  { label: 'Sign out', command: ({ item }) => signOut(item) },
];
```

| Field | Type | Meaning |
| --- | --- | --- |
| `label`, `ariaLabel` | `string` | Text; `ariaLabel` is the accessible name when an icon-only entry has no label. |
| `icon` | `string` | CSS classes of an icon font, e.g. `pi pi-home`. |
| `routerLink`, `queryParams` | `string \| unknown[]`, `object` | Router navigation; wins over `url`. |
| `url`, `target` | `string` | External link and its target. |
| `command` | `(event: { originalEvent: Event; item: HxMenuItem }) => void` | Called when the entry is activated. |
| `items` | `HxMenuItem[]` | Submenu, or a group when the entry has no action. |
| `disabled`, `visible`, `separator`, `id`, `badge` | | State, a hidden entry, a divider line, the element id, a short text next to the label. |

An item of the former helix-core menu model (`MenuItem`) is assignable to `HxMenuItem` as it is; a test keeps
that true. `HxBreadcrumbItem` is the same type.

## Validators

`@gravionlabs/helix-ui/validators` (a secondary entry point) holds the validators that carry their own error
message. The error text is the value of the error object, so a form field can show it directly.

```ts
import { FormControl } from '@angular/forms';
import { Validators } from '@gravionlabs/helix-ui/validators';

const email = new FormControl('', [
  Validators.required('Email is required'),
  Validators.email('Not an email address'),
]);
email.errors; // { Required: 'Email is required' } while the field is empty
```

- Each validator takes the message first, either a `string` or a function of the value (`(value) => string`).
- Validators for optional values take `allowEmpty` (default `true`): an empty value is valid unless you pass
  `false`.
- The error key is the `ValidatorKey` enum member (`Required`, `Email`, `Number`, `Integer`, `Min`, `Max`,
  `MinLength`, `MaxLength`, `Pattern`, `Date`, `OneOf`, `AllOf`), so templates and error resolvers can switch on it.
- It is the same code as `@gravionlabs/helix-core/validators`; `helix-zod` and the shell move to this entry point.

## Icons

Components draw the few icons they need themselves, as CSS masks in the colour of the element, so an app needs no
icon font for helix-ui to look right. The icons live in `projects/ui/styles/_icons.scss` (a partial: it emits no
CSS of its own) on a 24 × 24 grid with round caps and joins:

`chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `check`, `close`, `plus`, `minus`, `search`,
`calendar`, `eye`, `eye-off`, `upload`, `spinner`, `info`, `success`, `warn`, `error`, `star`, `star-filled`, `bars`.

```scss
@use 'icons' as *;

.hx-select-chevron {
  @include hx-icon(chevron-down, 1rem, var(--h-select-dropdown-color), 2.4);
}
```

`hx-icon($name, $size: 1em, $color: currentcolor, $stroke: 2)` sets the box, the colour and the mask; an unknown name
stops the build with the list of known icons. To add one, add its path to the `$hx-icons` map (a test compiles every
entry). `hx-icon-spin()` and `hx-icon-spin-keyframes()` turn an icon, with a slower turn for users who prefer
reduced motion.

Apps are free to keep PrimeIcons (`pi pi-*`) for the content of their own pages and for the `icon` field of menu
items; helix-ui components that take an icon (`icon="pi pi-home"`) accept the classes of any icon font.

## Migration status

`helix-ui` replaces the components of the vendored PrimeNG fork ([ADR 0001](adr/0001-styling-foundation.md)).

| Library / app   | State                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `helix-shell`   | No import from `helix-core`; `helix-ui` is a peer dependency (menu model, validators, theme service).                       |
| `helix-zod`     | No import from `helix-core`; the validators come from `@gravionlabs/helix-ui/validators`, the widgets draw `hx-*` controls. |
| `helix-ag-grid` | No import from `helix-core`; `helixGridTheme` styles AG Grid from the tokens.                                               |
| demo app        | No import from `helix-core`, no `provideHelix`.                                                                             |
| `helix-core`    | Nothing depends on it any more; it is removed from the workspace in a following step.                                       |

`pnpm lint:core-imports` fails when one of these libraries or the demo imports `helix-core`, so a migrated
library cannot slide back.

## Rules of the package

- Nothing in `helix-shell`, `helix-zod`, `helix-ag-grid` or the demo app imports `@gravionlabs/helix-core` (`pnpm lint:core-imports`).
- Nothing in `projects/ui` imports `@gravionlabs/helix-core`, `@primeuix/*` or `primeng` (`pnpm lint:no-core`).
- A test fails when a stylesheet reads a `--h-*` token that `tokens.css` does not define, or when a
  directive sets a class its stylesheet does not style.
- The component styles are SCSS (`projects/ui/styles/*.scss`) compiled at build time (`pnpm build:lib:css:ui`) to
  plain CSS: loops and mixins keep repetitive parts, such as the button severities, in one place, and the
  package ships and needs no SCSS. Components still read only `--h-*` tokens.
- Every component has unit tests, a page in [`docs/components`](components/README.md) and a section in the demo app.
