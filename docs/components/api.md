# API

> Shared services, tokens, and template primitives used across all Helix components.

## Import

```ts
import { Header, Footer, PrimeTemplate } from '@gravionlabs/helix/api';
```

## Components

### Header

Selector: `h-header`

### Footer

Selector: `h-footer`

### PrimeTemplate

Selector: `[hTemplate]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string \| undefined` | — | — |
| `name` | `string \| undefined` | — | — |

## Services

### ConfirmationService

Methods used in confirmation service.

### ContextMenuService

### FilterService

### MessageService

Message service used in messages and toast components.

### OverlayService

### TreeDragDropService

## Interfaces & Types

- `BlockableUI` — Represents a blockable user interface element.
- `Confirmation` — Represents a confirmation dialog configuration.
- `FilterMetadata` — Represents metadata for filtering a data set.
- `LazyLoadEvent` — Represents an event object for lazy loading data.
- `LazyLoadMeta` — Meta data for lazy load event.
- `Lifecycle`
- `LifecycleHooks`
- `MegaMenuItem` — MegaMenuItem API provides the following properties.
- `MenuItem` — MenuItem provides the following properties.
- `MenuItemCommandEvent` — Custom command event
- `OverlayModeType` — Represents the type of overlay mode, which can be 'modal', 'overlay', or undefined.
- `ResponsiveOverlayDirectionType` — Represents the type of direction for a responsive overlay, which can be one of the specified values or undefined.
- `OverlayListenerOptions` — Represents the options for an overlay listener.
- `ResponsiveOverlayOptions` — Represents the options for a responsive overlay.
- `OverlayOnShowEvent` — Represents an event that occurs when an overlay is shown.
- `OverlayOnBeforeShowEvent` — Represents an event that occurs before an overlay is shown.
- `OverlayOnBeforeHideEvent` — Represents an event that occurs before an overlay is hidden.
- `OverlayOnHideEvent` — Represents an event that occurs when an overlay is hidden.
- `OverlayOptions` — Represents the options for an overlay.
- `PassThroughOptions` — Defines the pass-through options.
- `PassThroughContext` — Defines the pass-through method options.
- `CommonPassThrough`
- `PassThroughOption`
- `PassThrough`
- `ScrollerOptions` — Options for the scroller.
- `SelectItem` — Represents an option item.
- `SelectItemGroup` — Represents a group of select items.
- `SortEvent` — Represents an event triggered when sorting is applied.
- `SortMeta` — Represents metadata for sorting.
- `TableState` — Represents the state of a table component.
- `ToastMessageOptions` — Deines valid options for the toast message.
- `TooltipOptions` — Defines options of Tooltip.
- `Translation` — Represents a set of translated strings used in a component or application.
- `Aria` — Represents a set of translated HTML attributes used in a component or application.
- `TreeNode` — Represents a node in a tree data structure.
- `TreeNodeDragEvent` — Represents the event data for a tree node drag operation.
- `TreeTableNode` — Tree table node element.

## Source

[`projects/helix/api`](../../projects/helix/api)
