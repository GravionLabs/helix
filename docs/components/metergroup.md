# MeterGroup

> MeterGroup displays scalar measurements within a known range.

## Import

```ts
import { MeterGroup, MeterGroupLabel } from '@gravionlabs/helix/metergroup';
```

## Components

### MeterGroup

Selector: `h-meterGroup, h-metergroup, h-meter-group`

MeterGroup displays scalar measurements within a known range.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `MeterItem[] \| undefined` | — | Current value of the metergroup. |
| `min` | `number` | `0` | Mininum boundary value. |
| `max` | `number` | `100` | Maximum boundary value. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Specifies the layout of the component, valid values are 'horizontal' and 'vertical'. |
| `labelPosition` | `'start' \| 'end'` | `'end'` | Specifies the label position of the component, valid values are 'start' and 'end'. |
| `labelOrientation` | `'horizontal' \| 'vertical' \| undefined` | `'horizontal'` | Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'. |
| `styleClass` | `string \| undefined` | — | Style class of the element. |

### MeterGroupLabel

Selector: `h-meterGroupLabel, h-metergrouplabel`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `any[]` | `[]` | — |
| `labelPosition` | `'start' \| 'end'` | `'end'` | — |
| `labelOrientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | — |
| `min` | `number` | — | — |
| `max` | `number` | — | — |
| `iconTemplate` | `TemplateRef&lt;MeterGroupIconTemplateContext&gt; \| undefined` | — | — |

## Source

[`projects/helix/metergroup`](../../projects/helix/metergroup)
