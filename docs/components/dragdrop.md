# DragDrop

> Drag-and-drop directives (`hDraggable`, `hDroppable`).

## Import

```ts
import { Draggable, Droppable } from '@gravionlabs/helix/dragdrop';
```

## Components

### Draggable

Selector: `[hDraggable]`

hDraggable directive apply draggable behavior to any element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `string \| undefined` | — | — |
| `dragEffect` | `'none' \| 'copy' \| 'copyLink' \| 'copyMove' \| 'link' \| 'linkMove' \| 'move' \| 'all' \| 'uninitialized' \| undefined` | — | Defines the cursor style. |
| `dragHandle` | `string \| undefined` | — | Selector to define the drag handle, by default anywhere on the target element is a drag handle to start dragging. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onDragStart` | `EventEmitter&lt;DragEvent&gt;` | Callback to invoke when drag begins. |
| `onDragEnd` | `EventEmitter&lt;DragEvent&gt;` | Callback to invoke when drag ends. |
| `onDrag` | `EventEmitter&lt;DragEvent&gt;` | Callback to invoke on dragging. |

### Droppable

Selector: `[hDroppable]`

hDroppable directive apply droppable behavior to any element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `string \| string[] \| undefined` | — | — |
| `dropEffect` | `'none' \| 'copy' \| 'link' \| 'move' \| undefined` | — | Defines the cursor style, valid values are none, copy, move, link, copyMove, copyLink, linkMove and all. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onDragEnter` | `EventEmitter&lt;DragEvent&gt;` | Callback to invoke when a draggable enters drop area. |
| `onDragLeave` | `EventEmitter&lt;DragEvent&gt;` | Callback to invoke when a draggable leave drop area. |
| `onDrop` | `EventEmitter&lt;DragEvent&gt;` | Callback to invoke when a draggable is dropped onto drop area. |

## Source

[`projects/helix/dragdrop`](../../projects/helix/dragdrop)
