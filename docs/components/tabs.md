# Tabs

`hx-tabs` shows one panel at a time, chosen by a row of tabs, in the WAI-ARIA tabs pattern.

```html
<hx-tabs [(value)]="tab" scrollable>
  <hx-tab-list>
    <hx-tab value="a">Profile</hx-tab>
    <hx-tab value="b">Billing</hx-tab>
    <hx-tab value="c" disabled>Soon</hx-tab>
  </hx-tab-list>
  <hx-tab-panels>
    <hx-tab-panel value="a">Profile content</hx-tab-panel>
    <hx-tab-panel value="b"><ng-template hxTabContent>Billing content</ng-template></hx-tab-panel>
  </hx-tab-panels>
</hx-tabs>
```

| Input        | Type             | Default | Description                                                           |
| ------------ | ---------------- | ------- | --------------------------------------------------------------------- |
| `value`      | `string \| null` | `null`  | `[(value)]`: the active tab; while `null` the first enabled tab is active. |
| `scrollable` | `boolean`        | `false` | Buttons at the ends of the list scroll tabs that overflow.            |
| `keepAlive`  | `boolean`        | `false` | Keep the content of lazy panels after their tab is left.              |

`hx-tab` and `hx-tab-panel` take `value` (required); a tab also takes `disabled`.

- **Lazy panels:** a panel whose content is in `<ng-template hxTabContent>` creates it when its tab first becomes
  active, and destroys it when the tab is left unless the tabs are `keepAlive`. Plain panel content is created up front
  and only hidden.
- **Keyboard:** Tab enters the list at the active tab (roving tabindex); Left and Right move to the previous and next
  enabled tab (wrapping), Home and End to the first and last, and the tab they reach is activated; Enter and Space
  activate a focused tab.
- **Accessibility:** `role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"` with
  `aria-labelledby`; disabled tabs are `aria-disabled` and skipped by the arrows. The scroll buttons are for the pointer
  and are not tab stops. Motion stops under `prefers-reduced-motion`.

## Tokens

The look comes from the design tokens `--h-tabs-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
