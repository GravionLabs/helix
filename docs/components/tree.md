# Tree

> Tree is used to display hierarchical data.

## Import

```ts
import { Tree, UITreeNode } from '@gravionlabs/helix/tree';
```

## Components

### Tree

Selector: `h-tree`

Tree is used to display hierarchical data.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeNode&lt;any&gt; \| TreeNode&lt;any&gt;[] \| any[] \| any` | — | An array of treenodes. |
| `selectionMode` | `'single' \| 'multiple' \| 'checkbox' \| null \| undefined` | — | Defines the selection mode. |
| `loadingMode` | `'mask' \| 'icon'` | `'mask'` | Loading mode display. |
| `selection` | `TreeNode&lt;any&gt; \| TreeNode&lt;any&gt;[] \| null \| undefined` | `null` | A single treenode instance or an array to refer to the selections. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `contextMenu` | `any` | — | Context menu instance. |
| `contextMenuSelectionMode` | `'separate' \| 'joint'` | `'joint'` | Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property. |
| `contextMenuSelection` | `TreeNode&lt;any&gt; \| null` | `null` | Selected node with a context menu. |
| `draggableScope` | `any` | — | Scope of the draggable nodes to match a droppableScope. |
| `droppableScope` | `any` | — | Scope of the droppable nodes to match a draggableScope. |
| `draggableNodes` | `boolean \| undefined` | — | Whether the nodes are draggable. |
| `droppableNodes` | `boolean \| undefined` | — | Whether the nodes are droppable. |
| `metaKeySelection` | `boolean` | `false` | Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| `propagateSelectionUp` | `boolean` | `true` | Whether checkbox selections propagate to ancestor nodes. |
| `propagateSelectionDown` | `boolean` | `true` | Whether checkbox selections propagate to descendant nodes. |
| `loading` | `boolean \| undefined` | — | Displays a loader to indicate data load is in progress. |
| `loadingIcon` | `string \| undefined` | — | The icon to show while indicating data load is in progress. |
| `emptyMessage` | `string` | `''` | Text to display when there is no data. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that labels the tree. |
| `togglerAriaLabel` | `string \| undefined` | — | Defines a string that labels the toggler icon for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `validateDrop` | `boolean \| undefined` | — | When enabled, drop can be accepted or rejected based on condition defined at onNodeDrop. |
| `filter` | `boolean \| undefined` | — | When specified, displays an input field to filter the items. |
| `filterInputAutoFocus` | `boolean` | `false` | Determines whether the filter input should be automatically focused when the component is rendered. |
| `filterBy` | `string` | `'label'` | When filtering is enabled, filterBy decides which field or fields (comma separated) to search against. |
| `filterMode` | `string` | `'lenient'` | Mode for filtering valid values are "lenient" and "strict". Default is lenient. |
| `filterOptions` | `any` | — | Mode for filtering valid values are "lenient" and "strict". Default is lenient. |
| `filterPlaceholder` | `string \| undefined` | — | Placeholder text to show when filter input is empty. |
| `filteredNodes` | `TreeNode&lt;any&gt;[] \| undefined \| null` | — | Values after the tree nodes are filtered. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `scrollHeight` | `string \| undefined` | — | Height of the scrollable viewport. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of an item in the list for VirtualScrolling. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `indentation` | `number` | `1.5` | Indentation factor for spacing of the nested node when virtual scrolling is enabled. |
| `_templateMap` | `any` | — | Custom templates of the component. |
| `trackBy` | `Function` | `(index: number, item: any) =&gt; item` | Function to optimize the node list rendering, default algorithm checks for object identity. |
| `highlightOnSelect` | `boolean` | `false` | Highlights the node on select. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onNodeSelect` | `EventEmitter&lt;TreeNodeSelectEvent&gt;` | Callback to invoke when a node is selected. |
| `onNodeUnselect` | `EventEmitter&lt;TreeNodeUnSelectEvent&gt;` | Callback to invoke when a node is unselected. |
| `onNodeExpand` | `EventEmitter&lt;TreeNodeExpandEvent&gt;` | Callback to invoke when a node is expanded. |
| `onNodeCollapse` | `EventEmitter&lt;TreeNodeCollapseEvent&gt;` | Callback to invoke when a node is collapsed. |
| `onNodeContextMenuSelect` | `EventEmitter&lt;TreeNodeContextMenuSelectEvent&gt;` | Callback to invoke when a node is selected with right click. |
| `onNodeDoubleClick` | `EventEmitter&lt;TreeNodeDoubleClickEvent&gt;` | Callback to invoke when a node is double clicked. |
| `onNodeDrop` | `EventEmitter&lt;TreeNodeDropEvent&gt;` | Callback to invoke when a node is dropped. |
| `onLazyLoad` | `EventEmitter&lt;TreeLazyLoadEvent&gt;` | Callback to invoke in lazy mode to load new data. |
| `onScroll` | `EventEmitter&lt;TreeScrollEvent&gt;` | Callback to invoke in virtual scroll mode when scroll position changes. |
| `onScrollIndexChange` | `EventEmitter&lt;TreeScrollIndexChangeEvent&gt;` | Callback to invoke in virtual scroll mode when scroll position and item's range in view changes. |
| `onFilter` | `EventEmitter&lt;TreeFilterEvent&gt;` | Callback to invoke when data is filtered. |

### UITreeNode

Selector: `h-treeNode`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rowNode` | `any` | — | — |
| `node` | `TreeNode&lt;any&gt; \| undefined` | — | — |
| `parentNode` | `TreeNode&lt;any&gt; \| undefined` | — | — |
| `root` | `boolean \| undefined` | — | — |
| `index` | `number \| undefined` | — | — |
| `firstChild` | `boolean \| undefined` | — | — |
| `lastChild` | `boolean \| undefined` | — | — |
| `level` | `number \| undefined` | — | — |
| `indentation` | `number \| undefined` | — | — |
| `itemSize` | `number \| undefined` | — | — |
| `loadingMode` | `string` | — | — |

## Source

[`projects/helix/tree`](../../projects/helix/tree)
