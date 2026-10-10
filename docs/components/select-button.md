# Select button

`hx-select-button` is a choice among a few options as a joined group of toggle buttons: native buttons with
`aria-pressed` in a `role="group"`. Single choice by default, `multiple` for an array.

```html
<hx-select-button [options]="['Left', 'Center', 'Right']" [(ngModel)]="align" [allowEmpty]="false" ariaLabel="Alignment" />
<hx-select-button [options]="toppings" multiple [(value)]="chosen" />
```

Options, `optionLabel`, `optionValue` and `optionDisabled` work as in the Select. `allowEmpty` (default `true`)
decides whether a chosen option can be switched off again; `size` and `fluid` as usual. It works with `ngModel`,
reactive forms and signal forms. Give the group a name with `ariaLabel` or `ariaLabelledby`.

## Tokens

The look comes from the design tokens `--h-selectbutton-*`, `--h-togglebutton-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
