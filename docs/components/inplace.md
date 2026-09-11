# Inplace

> Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.

## Import

```ts
import { InplaceDisplay, InplaceContent, Inplace } from '@helix-ui/core/inplace';
```

## Components

### InplaceDisplay

Selector: `h-inplacedisplay, h-inplaceDisplay`

### InplaceContent

Selector: `h-inplacecontent, h-inplaceContent`

### Inplace

Selector: `h-inplace`

Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | `boolean \| undefined` | `false` | Whether the content is displayed or not. |
| `closable` | `boolean \| undefined` | `false` | Displays a button to switch back to display mode. |
| `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the element should be disabled. |
| `preventClick` | `boolean \| undefined` | — | Allows to prevent clicking. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `closeIcon` | `string \| undefined` | — | Icon to display in the close button. |
| `closeAriaLabel` | `string \| undefined` | — | Establishes a string value that labels the close button. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onActivate` | `output&lt;Event \| undefined&gt;()` | Callback to invoke when inplace is opened. |
| `onDeactivate` | `output&lt;Event \| undefined&gt;()` | Callback to invoke when inplace is closed. |

## Source

[`projects/core/inplace`](../../projects/core/inplace)
