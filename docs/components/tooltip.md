# Tooltip

> Tooltip directive provides advisory information for a component.

## Import

```ts
import { Tooltip } from '@gravionlabs/helix/tooltip';
```

## Directives

### Tooltip

Selector: `[hTooltip]`

Tooltip directive provides advisory information for a component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `tooltipPosition` | `'right' \| 'left' \| 'top' \| 'bottom' \| string \| undefined` | — | Position of the tooltip. |
| `tooltipEvent` | `'hover' \| 'focus' \| 'both'` | `'hover'` | Event to show the tooltip. |
| `positionStyle` | `string \| undefined` | — | Type of CSS position. |
| `tooltipStyleClass` | `string \| undefined` | — | Style class of the tooltip. |
| `tooltipZIndex` | `string \| undefined` | — | Whether the z-index should be managed automatically to always go on top or have a fixed value. |
| `escape` | `boolean` | `true` | By default the tooltip contents are rendered as text. Set to false to support html tags in the content. |
| `showDelay` | `number \| undefined` | — | Delay to show the tooltip in milliseconds. |
| `hideDelay` | `number \| undefined` | — | Delay to hide the tooltip in milliseconds. |
| `life` | `number \| undefined` | — | Time to wait in milliseconds to hide the tooltip even it is active. |
| `positionTop` | `number \| undefined` | — | Specifies the additional vertical offset of the tooltip from its default position. |
| `positionLeft` | `number \| undefined` | — | Specifies the additional horizontal offset of the tooltip from its default position. |
| `autoHide` | `boolean` | `true` | Whether to hide tooltip when hovering over tooltip content. |
| `fitContent` | `boolean` | `true` | Automatically adjusts the element position when there is not enough space on the selected position. |
| `hideOnEscape` | `boolean` | `true` | Whether to hide tooltip on escape key press. |
| `showOnEllipsis` | `boolean` | `false` | Whether to show the tooltip only when the target text overflows (e.g., ellipsis is active). |
| `content` | `string \| TemplateRef&lt;HTMLElement&gt; \| undefined` | — | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions \| undefined` | — | Specifies the tooltip configuration options for the component. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `ptTooltip` | `TooltipPassThrough \| undefined` | — | Used to pass attributes to DOM elements inside the Tooltip component. |
| `pTooltipPT` | `TooltipPassThrough \| undefined` | — | Used to pass attributes to DOM elements inside the Tooltip component. |
| `pTooltipUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |

## Source

[`projects/helix/tooltip`](../../projects/helix/tooltip)
