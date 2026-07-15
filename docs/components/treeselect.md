# TreeSelect

> TreeSelect is a form component to choose from hierarchical data.

## Import

```ts
import { TreeSelect } from '@gravionlabs/helix/treeselect';
```

## Components

### TreeSelect

Selector: `h-treeSelect, h-treeselect, h-tree-select`

TreeSelect is a form component to choose from hierarchical data.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `inputId` | `string \| undefined` | — | Identifier of the underlying input element. |
| `scrollHeight` | `string` | `'400px'` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| `metaKeySelection` | `boolean` | `false` | Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| `display` | `'comma' \| 'chip'` | `'comma'` | Defines how the selected items are displayed. |
| `selectionMode` | `'single' \| 'multiple' \| 'checkbox'` | `'single'` | Defines the selection mode. |
| `tabindex` | `string \| undefined` | `'0'` | Index of the element in tabbing order. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `placeholder` | `string \| undefined` | — | Label to display when there are no selections. |
| `panelClass` | `string \| string[] \| Set&lt;string&gt; \| { [klass: string]: any } \| undefined` | — | Style class of the overlay panel. |
| `panelStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the panel element. |
| `panelStyleClass` | `string \| undefined` | — | Style class of the panel element. |
| `containerStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the container element. |
| `containerStyleClass` | `string \| undefined` | — | Style class of the container element. |
| `labelStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the label element. |
| `labelStyleClass` | `string \| undefined` | — | Style class of the label element. |
| `overlayOptions` | `OverlayOptions \| undefined` | — | Specifies the options for the overlay. |
| `emptyMessage` | `string` | `''` | Text to display when there are no options available. Defaults to value from Helix locale configuration. |
| `filter` | `boolean` | `false` | When specified, displays an input field to filter the items. |
| `filterBy` | `string` | `'label'` | When filtering is enabled, filterBy decides which field or fields (comma separated) to search against. |
| `filterMode` | `string` | `'lenient'` | Mode for filtering valid values are "lenient" and "strict". Default is lenient. |
| `filterPlaceholder` | `string \| undefined` | — | Placeholder text to show when filter input is empty. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `filterInputAutoFocus` | `boolean` | `true` | Determines whether the filter input should be automatically focused when the component is rendered. |
| `propagateSelectionDown` | `boolean` | `true` | Whether checkbox selections propagate to descendant nodes. |
| `propagateSelectionUp` | `boolean` | `true` | Whether checkbox selections propagate to ancestor nodes. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `resetFilterOnHide` | `boolean` | `true` | Clears the filter value when hiding the dropdown. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of an item in the list for VirtualScrolling. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `loading` | `boolean \| undefined` | — | Displays a loader to indicate data load is in progress. |
| `loadingMode` | `'mask' \| 'icon'` | `'mask'` | Loading mode display. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onNodeExpand` | `EventEmitter&lt;TreeSelectNodeExpandEvent&gt;` | Callback to invoke when a node is expanded. |
| `onNodeCollapse` | `EventEmitter&lt;TreeSelectNodeCollapseEvent&gt;` | Callback to invoke when a node is collapsed. |
| `onShow` | `EventEmitter&lt;any&gt;` | Callback to invoke when the overlay is shown. |
| `onHide` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the overlay is hidden. |
| `onClear` | `EventEmitter&lt;any&gt;` | Callback to invoke when input field is cleared. |
| `onFilter` | `EventEmitter&lt;TreeFilterEvent&gt;` | Callback to invoke when data is filtered. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when treeselect gets focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when treeselect loses focus. |
| `onNodeUnselect` | `EventEmitter&lt;TreeNodeUnSelectEvent&gt;` | Callback to invoke when a node is unselected. |
| `onNodeSelect` | `EventEmitter&lt;TreeNodeSelectEvent&gt;` | Callback to invoke when a node is selected. |

## Source

[`projects/helix/treeselect`](../../projects/helix/treeselect)
