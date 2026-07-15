# Chip

> Chip represents people using icons, labels and images.

## Import

```ts
import { Chip } from '@gravionlabs/helix/chip';
```

## Components

### Chip

Selector: `h-chip`

Chip represents people using icons, labels and images.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| undefined` | — | Defines the text to display. |
| `icon` | `string \| undefined` | — | Defines the icon to display. |
| `image` | `string \| undefined` | — | Defines the image to display. |
| `alt` | `string \| undefined` | — | Alt attribute of the image. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the element should be disabled. |
| `removable` | `boolean \| undefined` | `false` | Whether to display a remove icon. |
| `removeIcon` | `string \| undefined` | — | Icon of the remove element. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onRemove` | `EventEmitter&lt;MouseEvent&gt;` | Callback to invoke when a chip is removed. |
| `onImageError` | `EventEmitter&lt;Event&gt;` | This event is triggered if an error occurs while loading an image file. |

## Source

[`projects/helix/chip`](../../projects/helix/chip)
