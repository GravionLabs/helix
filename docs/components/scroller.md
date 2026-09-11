# Scroller

> Scroller is a performance-approach to handle huge data efficiently.

## Import

```ts
import { Scroller } from '@helix-ui/core/scroller';
```

## Components

### Scroller

Selector: `h-scroller, h-virtualscroller, h-virtual-scroller, h-virtualScroller`

Scroller is a performance-approach to handle huge data efficiently.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `string` | `''` | — |
| `id` | `string \| undefined` | — | Unique identifier of the element. |
| `style` | `any` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the element. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |
| `items` | `any[] \| null \| undefined` | — | An array of objects to display. |
| `itemSize` | `number \| number[]` | `0` | The height/width of item according to orientation. |
| `scrollHeight` | `string \| undefined` | — | Height of the scroll viewport. |
| `scrollWidth` | `string \| undefined` | — | Width of the scroll viewport. |
| `orientation` | `"horizontal" \| "vertical" \| "both"` | `'vertical'` | The orientation of scrollbar. |
| `step` | `number` | `0` | Used to specify how many items to load in each load method in lazy mode. |
| `delay` | `number` | `0` | Delay in scroll before new data is loaded. |
| `resizeDelay` | `number` | `10` | Delay after window's resize finishes. |
| `appendOnly` | `boolean` | `false` | Used to append each loaded item to top without removing any items from the DOM. Using very large data may cause the browser to crash. |
| `inline` | `boolean` | `false` | Specifies whether the scroller should be displayed inline or not. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `disabled` | `boolean` | `false` | If disabled, the scroller feature is eliminated and the content is displayed directly. |
| `loaderDisabled` | `boolean` | `false` | Used to implement a custom loader instead of using the loader feature in the scroller. |
| `columns` | `any[] \| null \| undefined` | — | Columns to display. |
| `showSpacer` | `boolean` | `true` | Used to implement a custom spacer instead of using the spacer feature in the scroller. |
| `showLoader` | `boolean` | `false` | Defines whether to show loader. |
| `numToleratedItems` | `number \| undefined` | — | Determines how many additional elements to add to the DOM outside of the view. According to the scrolls made up and down, extra items are added in a certain algorithm in the form of multiples of this number. Default value is half the number of items shown in the view. |
| `loading` | `boolean \| undefined` | — | Defines whether the data is loaded. |
| `autoSize` | `boolean` | `false` | Defines whether to dynamically change the height or width of scrollable container. |
| `trackBy` | `Function \| undefined` | — | Function to optimize the dom operations by delegating to ngForTrackBy, default algoritm checks for object identity. |
| `options` | `ScrollerOptions \| undefined` | — | Defines whether to use the scroller feature. The properties of scroller component can be used like an object in it. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onLazyLoad` | `output&lt;ScrollerLazyLoadEvent&gt;()` | Callback to invoke in lazy mode to load new data. |
| `onScroll` | `output&lt;ScrollerScrollEvent&gt;()` | Callback to invoke when scroll position changes. |
| `onScrollIndexChange` | `output&lt;ScrollerScrollIndexChangeEvent&gt;()` | Callback to invoke when scroll position and item's range in view changes. |

## Source

[`projects/core/scroller`](../../projects/core/scroller)
