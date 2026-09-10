# DragDrop

> Drag-and-drop directives (`hDraggable`, `hDroppable`).

## Import

```ts
import { Draggable, Droppable } from '@helix-ui/core/dragdrop';
```

## Directives

### Draggable

Selector: `[hDraggable]`

hDraggable directive apply draggable behavior to any element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `string \| undefined` | — | — |
| `dragEffect` | `"none" \| "copy" \| "copyLink" \| "copyMove" \| "link" \| "linkMove" \| "move" \| "all" \| "uninitialized" \| undefined` | — | Defines the cursor style. |
| `dragHandle` | `string \| undefined` | — | Selector to define the drag handle, by default anywhere on the target element is a drag handle to start dragging. |
| `pDraggableDisabled` | `boolean` | `false` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onDragStart` | `output&lt;DragEvent&gt;()` | Callback to invoke when drag begins. |
| `onDragEnd` | `output&lt;DragEvent&gt;()` | Callback to invoke when drag ends. |
| `onDrag` | `output&lt;DragEvent&gt;()` | Callback to invoke on dragging. |

### Droppable

Selector: `[hDroppable]`

hDroppable directive apply droppable behavior to any element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `string \| string[] \| undefined` | — | — |
| `pDroppableDisabled` | `boolean` | `false` | Whether the element is droppable, useful for conditional cases. |
| `dropEffect` | `"none" \| "copy" \| "link" \| "move" \| undefined` | — | Defines the cursor style, valid values are none, copy, move, link, copyMove, copyLink, linkMove and all. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onDragEnter` | `output&lt;DragEvent&gt;()` | Callback to invoke when a draggable enters drop area. |
| `onDragLeave` | `output&lt;DragEvent&gt;()` | Callback to invoke when a draggable leave drop area. |
| `onDrop` | `output&lt;DragEvent&gt;()` | Callback to invoke when a draggable is dropped onto drop area. |

## Source

[`projects/core/dragdrop`](../../projects/core/dragdrop)
