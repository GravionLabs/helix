# Tree

`hx-tree` shows hierarchical data with expand and collapse, selection, a filter and lazy children, in the WAI-ARIA tree
view pattern.

```html
<hx-tree [value]="nodes" selectionMode="single" [(selection)]="selected" ariaLabel="Files" />
<hx-tree [value]="nodes" selectionMode="checkbox" [(selection)]="checked" filter filterMode="strict" />
```

`HxTreeNode`: `{ key, label, icon?, children?, leaf?, expanded?, loading?, disabled?, data? }`. Keys must be unique in
the whole tree.

| Input / output  | Type                                              | Default     | Description                                                          |
| --------------- | ------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `value`         | `HxTreeNode[]`                                    | `[]`        | The root nodes; pass a new array to change the tree.                 |
| `selectionMode` | `'none' \| 'single' \| 'multiple' \| 'checkbox'`  | `'none'`    | How nodes are selected.                                              |
| `selection`     | `string \| string[] \| null`                      | `null`      | `[(selection)]`: a key (single) or keys (multiple, checkbox).        |
| `filter`        | `boolean`                                         | `false`     | A text field above the tree filters by label.                        |
| `filterMode`    | `'lenient' \| 'strict'`                           | `'lenient'` | Lenient: a match shows its children; strict: matches and ancestors.  |
| `filterPlaceholder`, `filterLabel`, `emptyMessage` | `string`       | `''`, `'Filter'`, `'No results found'` | Texts.                          |
| `ariaLabel`     | `string`                                          |             | Accessible name of the tree.                                         |
| `(nodeExpand)`, `(nodeCollapse)` | `{ node }`                       |             | A node was expanded or collapsed.                                    |

`expand(key)`, `collapse(key)`, `toggle(key)`, `expandAll()`, `collapseAll()` and `select(key)` are public methods.

- **Node template:** `<ng-template hxTreeNode let-node let-level="level" let-selected="selected" let-expanded="expanded">`
  replaces the icon and label of a row.
- **Checkbox mode:** checking a node checks everything below it; a parent is checked when all its children are and
  `aria-checked="mixed"` when only some are. Disabled nodes are skipped.
- **Lazy children:** give the node `leaf: false`; on `(nodeExpand)` set `loading: true`, fetch, then pass a new `value`
  with the children (and without `loading`). Filtering opens the ancestors of matches.
- **Keyboard:** Tab enters the tree once (one tab stop); Up/Down move, Right expands or goes to the first child, Left
  collapses or goes to the parent, Home/End jump, typing jumps by label, Enter or Space selects (checks). Ctrl-click
  deselects in `single` mode.
- **Accessibility:** `role="tree"`, `treeitem` (`aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded`),
  `group`; `aria-selected` (single, multiple) or `aria-checked` (checkbox); `aria-multiselectable` when several can be
  chosen. The toggle and the checkbox are decoration for the pointer (`aria-hidden`).

## Tokens

The look comes from the design tokens `--h-tree-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
