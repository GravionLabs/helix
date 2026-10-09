# Card

`hx-card` is a surface for grouped content. Project a header with `hxCardHeader` (an image, say), a title with
`hxCardTitle`, a subtitle with `hxCardSubtitle`, the content, and a footer with `hxCardFooter`; or use the `title` and
`subtitle` inputs as a shortcut. Regions without content take no space.

```html
<hx-card title="Billing" subtitle="October" [headingLevel]="3">
  <img hxCardHeader src="chart.png" alt="" />
  Total due: 120 EUR
  <div hxCardFooter><button hx-button>Pay</button></div>
</hx-card>
```

| Input          | Type     | Default | Description                                              |
| -------------- | -------- | ------- | -------------------------------------------------------- |
| `title`        | `string` | `''`    | The title (a shortcut for the `hxCardTitle` slot).       |
| `subtitle`     | `string` | `''`    | The subtitle (a shortcut for the `hxCardSubtitle` slot). |
| `headingLevel` | `number` | `2`     | Level of the title heading, 1 to 6.                      |

- **Accessibility:** the title is a real heading (`h1` to `h6` by `headingLevel`) so the page outline stays right;
  the card adds no role. An empty title is hidden, not left as an empty heading.

## Tokens

The look comes from the design tokens `--h-card-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
