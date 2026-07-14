# Avatar

> Avatar represents people using icons, labels and images.

## Import

```ts
import { Avatar } from '@gravionlabs/helix/avatar';
```

## Components

### Avatar

Selector: `h-avatar`

Avatar represents people using icons, labels and images.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| undefined` | — | Defines the text to display. |
| `icon` | `string \| undefined` | — | Defines the icon to display. |
| `image` | `string \| undefined` | — | Defines the image to display. |
| `size` | `'normal' \| 'large' \| 'xlarge' \| undefined` | `'normal'` | Size of the element. |
| `shape` | `'square' \| 'circle' \| undefined` | `'square'` | Shape of the element. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `ariaLabel` | `string \| undefined` | — | Establishes a string value that labels the component. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onImageError` | `EventEmitter&lt;Event&gt;` | This event is triggered if an error occurs while loading an image file. |

## Source

[`projects/helix/avatar`](../../projects/helix/avatar)
