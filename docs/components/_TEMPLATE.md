# <Module Title>

> One-sentence description of the module (taken from the main class JSDoc, or hand-written for infrastructure modules).

## Import

```ts
import { <MainExports> } from '@gravionlabs/helix/<module>';
```

## Components <!-- or "## Directives" for directive-only modules -->

### <ClassName>

Selector: `<h-selector>`

Class-level JSDoc description.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |

## Services <!-- optional: @Injectable exports -->

## Pipes <!-- optional -->

## Functions <!-- optional: exported functions -->

## Interfaces & Types <!-- optional: exported interfaces/type aliases -->

## Source

[`projects/helix/<module>`](../../projects/helix/<module>)

<!--
Conventions:
- Title uses the canonical component name (e.g. AutoComplete, InputNumber).
- Inputs cover both decorator (@Input) and signal (input()/model()) APIs; defaults come
  from the initializer, "_required_" marks input.required().
- Selectors are listed exactly as declared, including attribute selectors ([hTooltip]).
- Every page is linked from README.md in this directory.
-->
