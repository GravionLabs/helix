# OrganizationChart

> OrganizationChart visualizes hierarchical organization data.

## Import

```ts
import { OrganizationChartNode, OrganizationChart } from '@helix-ui/core/organizationchart';
```

## Components

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

### OrganizationChart

Selector: `h-organizationChart, h-organization-chart, h-organizationchart`

OrganizationChart visualizes hierarchical organization data.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeNode&lt;any&gt;[] \| undefined` | — | An array of nested TreeNodes. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `selectionMode` | `"single" \| "multiple" \| null \| undefined` | — | Defines the selection mode. |
| `collapsible` | `boolean \| undefined` | — | Whether the nodes can be expanded or toggled. |
| `preserveSpace` | `boolean` | `true` | Whether the space allocated by a node is preserved when hidden. |
| `selection` | `any` | — | A single treenode instance or an array to refer to the selections. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onNodeSelect` | `output&lt;OrganizationChartNodeSelectEvent&gt;()` | Callback to invoke when a node is selected. |
| `onNodeUnselect` | `output&lt;OrganizationChartNodeUnSelectEvent&gt;()` | Callback to invoke when a node is unselected. |
| `onNodeExpand` | `output&lt;OrganizationChartNodeExpandEvent&gt;()` | Callback to invoke when a node is expanded. |
| `onNodeCollapse` | `output&lt;OrganizationChartNodeCollapseEvent&gt;()` | Callback to invoke when a node is collapsed. |

## Source

[`projects/core/organizationchart`](../../projects/core/organizationchart)
