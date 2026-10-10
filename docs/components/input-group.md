# Input group

`hx-input-group` joins a field with text or button addons into one control. Children: `hx-input`, `hx-select`,
`hx-input-number`, `hx-icon-field`, `button[hx-button]` and `hx-input-group-addon` (text or an icon).

```html
<hx-input-group>
  <hx-input-group-addon id="scheme">https://</hx-input-group-addon>
  <input hx-input aria-label="Domain" aria-describedby="scheme" />
  <button hx-button type="button">Go</button>
</hx-input-group>
```

The group has no inputs. Neighbours overlap by their border, inner corners are square and the outer corners
keep the radius; the group is as wide as its container. The addon reads the `--h-inputgroup-addon-*` tokens.

- **Accessibility:** the group adds no role. Addon text is not part of the field's name; reference it with
  `aria-describedby` (give the addon an `id`) when it carries information, and label the field itself.

## Tokens

The look comes from the design tokens `--h-inputgroup-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
