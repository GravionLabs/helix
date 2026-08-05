# KeyFilter

> KeyFilter Directive is a built-in feature of InputText to restrict user input based on a regular expression.

## Import

```ts
import { KeyFilter } from '@helix/core/keyfilter';
```

## Directives

### KeyFilter

Selector: `[hKeyFilter]`

KeyFilter Directive is a built-in feature of InputText to restrict user input based on a regular expression.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pValidateOnly` | `boolean \| undefined` | — | When enabled, instead of blocking keys, input is validated internally to test against the regular expression. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `ngModelChange` | `EventEmitter&lt;string \| number&gt;` | Emits a value whenever the ngModel of the component changes. |

## Interfaces & Types

- `KeyFilterPattern`

## Source

[`projects/core/keyfilter`](../../projects/core/keyfilter)
