# Tabs

> Tabs facilitates seamless switching between different views.

## Import

```ts
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@helix-ui/core/tabs';
```

## Components

### Tab

Selector: `h-tab`

Defines valid properties in Tab component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| undefined` | — | Value of tab. |
| `disabled` | `boolean` | `false` | Whether the tab is disabled. |

### TabList

Selector: `h-tablist`

TabList is a helper component for Tabs component.

### TabPanel

Selector: `h-tabpanel`

TabPanel is a helper component for Tabs component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `lazy` | `boolean` | `false` | When enabled, tab is not rendered until activation. |
| `value` | `string \| number \| undefined` | — | Value of the active tab. |

### TabPanels

Selector: `h-tabpanels`

TabPanels is a helper component for Tabs component.

### Tabs

Selector: `h-tabs`

Tabs facilitates seamless switching between different views.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| undefined` | — | Value of the active tab. |
| `scrollable` | `boolean` | `false` | When specified, enables horizontal and/or vertical scrolling. |
| `lazy` | `boolean` | `false` | When enabled, tabs are not rendered until activation. |
| `selectOnFocus` | `boolean` | `false` | When enabled, the focused tab is activated. |
| `showNavigators` | `boolean` | `true` | Whether to display navigation buttons in container when scrollable is enabled. |
| `tabindex` | `number` | `0` | Tabindex of the tab buttons. |

## Source

[`projects/core/tabs`](../../projects/core/tabs)
