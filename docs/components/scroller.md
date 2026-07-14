# Scroller

> Scroller is a performance-approach to handle huge data efficiently.

## Import

```ts
import { Scroller } from '@gravionlabs/helix/scroller';
```

## Components

### Scroller

Selector: `h-scroller, h-virtualscroller, h-virtual-scroller, h-virtualScroller`

Scroller is a performance-approach to handle huge data efficiently.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `unknown` | `''` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onLazyLoad` | `EventEmitter&lt;ScrollerLazyLoadEvent&gt;` | Callback to invoke in lazy mode to load new data. |
| `onScroll` | `EventEmitter&lt;ScrollerScrollEvent&gt;` | Callback to invoke when scroll position changes. |
| `onScrollIndexChange` | `EventEmitter&lt;ScrollerScrollIndexChangeEvent&gt;` | Callback to invoke when scroll position and item's range in view changes. |

## Source

[`projects/helix/scroller`](../../projects/helix/scroller)
