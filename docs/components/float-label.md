# Float label

`hx-float-label` wraps one control and its `<label for>` (the label comes after the control). The label sits in
the field and moves up when the control has focus or a value.

```html
<hx-float-label variant="on">
  <input hx-input id="email" [(ngModel)]="email" />
  <label for="email">Email</label>
</hx-float-label>
<hx-float-label>
  <hx-select inputId="color" [options]="colors" [(value)]="color" />
  <label for="color">Color</label>
</hx-float-label>
```

| Input     | Type                      | Default  | Description                                                                          |
| --------- | ------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `variant` | `'over' \| 'in' \| 'on'`  | `'over'` | `over`: above the field, `in`: inside it (the field gets room), `on`: on its top border. |

- **Behaviour:** a native `hx-input` or `textarea` floats by `:focus-within` and `:placeholder-shown`; an input
  without a `placeholder` gets a blank one, and an explicit placeholder is hidden while the label sits in the field.
  `hx-select`, `hx-password` and `hx-input-number` float by the `hx-filled` class they set while they hold a value;
  a component that holds a value sets the same class to take part. The `over` label leaves the field's box:
  give the wrapper room above (`margin-top`). Invalid fields (`aria-invalid="true"`, `ng-invalid ng-touched`) tint
  the label with `--h-floatlabel-invalid-color`. Motion stops under `prefers-reduced-motion`.
- **Accessibility:** the label stays a real `<label for>`, so the control keeps its name and a click on the label
  focuses it. Nothing but styling changes with the focus, so keyboard use is unchanged.

## Tokens

The look comes from the design tokens `--h-floatlabel-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
