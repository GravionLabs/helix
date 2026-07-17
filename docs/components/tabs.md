# Tabs

> Tabs facilitates seamless switching between different views.

## Import

```ts
import { Tabs, Tab, TabList } from '@gravionlabs/helix/tabs';
```

## Components

### Tabs

Selector: `h-tabs`

Tabs facilitates seamless switching between different views.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| undefined` | `undefined` | Value of the active tab. |
| `scrollable` | `unknown` | `false` | When specified, enables horizontal and/or vertical scrolling. |
| `lazy` | `unknown` | `false` | When enabled, tabs are not rendered until activation. |
| `selectOnFocus` | `unknown` | `false` | When enabled, the focused tab is activated. |
| `showNavigators` | `unknown` | `true` | Whether to display navigation buttons in container when scrollable is enabled. |
| `tabindex` | `unknown` | `0` | Tabindex of the tab buttons. |

### Tab

Selector: `h-tab`

Defines valid properties in Tab component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| string \| undefined` | — | Value of tab. |
| `disabled` | `unknown` | `false` | Whether the tab is disabled. |

### TabList

Selector: `h-tablist`

TabList is a helper component for Tabs component.

### TabPanel

Selector: `h-tabpanel`

TabPanel is a helper component for Tabs component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `lazy` | `unknown` | `false` | When enabled, tab is not rendered until activation. |
| `value` | `string \| number \| undefined` | `undefined` | Value of the active tab. |

### TabPanels

Selector: `h-tabpanels`

TabPanels is a helper component for Tabs component.

## Source

[`projects/helix/tabs`](../../projects/helix/tabs)
