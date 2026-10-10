# Avatar

`hx-avatar` shows a picture, an icon or initials for a person; `hx-avatar-group` overlaps several.

```html
<hx-avatar image="/amy.png" ariaLabel="Amy Elsner" shape="circle" />
<hx-avatar label="JK" size="large" />
<hx-avatar-group ariaLabel="Team">
  <hx-avatar image="/a.png" shape="circle" />
  <hx-avatar label="+2" shape="circle" />
</hx-avatar-group>
```

| Input       | Type                                | Default    | Description                                                       |
| ----------- | ----------------------------------- | ---------- | ----------------------------------------------------------------- |
| `label`     | `string`                            |            | Initials or a short text (or project content instead).            |
| `icon`      | `string`                            |            | Icon font classes.                                                |
| `image`     | `string`                            |            | Picture; wins over `icon`, which wins over `label`.               |
| `size`      | `'normal' \| 'large' \| 'xlarge'`    | `'normal'` | 2rem, 3rem, 4rem.                                                 |
| `shape`     | `'square' \| 'circle'`              | `'square'` | Corner radius or a circle.                                        |
| `ariaLabel` | `string`                            |            | Accessible name; makes the avatar a named `img`.                  |

The group takes `ariaLabel` and sets `role="group"`.

- **Accessibility:** with `ariaLabel` the avatar is a named `img` and its content is hidden from assistive
  technology. Without it, initials are read as text and a picture is decorative (empty `alt`), so name any avatar that
  stands alone. A `+2` overflow avatar reads as text; give it an `ariaLabel` such as "2 more members".

## Tokens

The look comes from the design tokens `--h-avatar-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
