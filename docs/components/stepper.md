# Stepper

`hx-stepper` shows the steps of a process as a row of headers above the panel of the active step.

```html
<hx-stepper [(value)]="step" linear>
  <hx-step-list>
    <hx-step [value]="1">Account</hx-step>
    <hx-step [value]="2">Address</hx-step>
  </hx-step-list>
  <hx-step-panels>
    <hx-step-panel [value]="1">
      <ng-template hxStepContent let-activateCallback="activateCallback">
        <button hx-button (click)="activateCallback(2)">Next</button>
      </ng-template>
    </hx-step-panel>
    <hx-step-panel [value]="2">Address form</hx-step-panel>
  </hx-step-panels>
</hx-stepper>
```

| Input       | Type                      | Default | Description                                                            |
| ----------- | ------------------------- | ------- | ---------------------------------------------------------------------- |
| `value`     | `string \| number \| null` | `null`  | `[(value)]`: the active step; while `null` the first enabled step is active. |
| `linear`    | `boolean`                 | `false` | Steps after the active one are disabled in the header.                 |
| `keepAlive` | `boolean`                 | `false` | Keep the content of lazy panels after their step is left.              |

`hx-step` and `hx-step-panel` take `value` (required); a step also takes `disabled`. `next()` and `previous()` on the
stepper (a template reference works) move to the neighbouring step.

- **Completed steps:** the steps before the active one show a check mark and their separator in the active colour.
- **Linear:** the header cannot jump ahead; the app moves on with `activateCallback(value)` (or `next()`) once the
  step is valid. Going back is always possible.
- **Lazy panels:** content in `<ng-template hxStepContent>` is created when its step first becomes active and
  destroyed when it is left unless `keepAlive`; the template context has `activateCallback` and `value`. Plain panel
  content is created up front and only hidden.
- **Accessibility:** the headers are buttons in a list, the active one has `aria-current="step"` and each controls its
  panel (`role="region"`, `aria-labelledby`). Disabled steps are really `disabled`. Below 40rem only the title of
  the active step is shown. Motion stops under `prefers-reduced-motion`.
- Horizontal layout only; a vertical stepper is not part of this version.

## Tokens

The look comes from the design tokens `--h-stepper-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
