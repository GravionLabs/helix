# OrganizationChart

> OrganizationChart visualizes hierarchical organization data.

## Import

```ts
import { OrganizationChart, OrganizationChartNode } from '@gravionlabs/helix/organizationchart';
```

## Components

### OrganizationChart

Selector: `h-organizationChart, h-organization-chart, h-organizationchart`

OrganizationChart visualizes hierarchical organization data.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeNode[] \| undefined` | — | An array of nested TreeNodes. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `selectionMode` | `'single' \| 'multiple' \| null \| undefined` | — | Defines the selection mode. |
| `collapsible` | `boolean \| undefined` | — | Whether the nodes can be expanded or toggled. |
| `preserveSpace` | `boolean` | `true` | Whether the space allocated by a node is preserved when hidden. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `selectionChange` | `EventEmitter&lt;any&gt;` | Callback to invoke on selection change. |
| `onNodeSelect` | `EventEmitter&lt;OrganizationChartNodeSelectEvent&gt;` | Callback to invoke when a node is selected. |
| `onNodeUnselect` | `EventEmitter&lt;OrganizationChartNodeUnSelectEvent&gt;` | Callback to invoke when a node is unselected. |
| `onNodeExpand` | `EventEmitter&lt;OrganizationChartNodeExpandEvent&gt;` | Callback to invoke when a node is expanded. |
| `onNodeCollapse` | `EventEmitter&lt;OrganizationChartNodeCollapseEvent&gt;` | Callback to invoke when a node is collapsed. |

### OrganizationChartNode

Selector: `[hOrganizationChartNode]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `node` | `TreeNode&lt;any&gt; \| undefined` | — | — |
| `root` | `boolean \| undefined` | — | — |
| `first` | `boolean \| undefined` | — | — |
| `last` | `boolean \| undefined` | — | — |
| `collapsible` | `boolean \| undefined` | — | — |

## Source

[`projects/helix/organizationchart`](../../projects/helix/organizationchart)
