# ADR 0010: Component tokens reference the type and spacing steps

- Status: proposed
- Date: 2026-11-26
- Issues: #1209, #1206
- Builds on: [ADR 0009](0009-type-scale-spacing-form-field-list-row-and-lint-preset.md)

## Context

ADR 0009 fixes the names and values of the type scale (`--h-font-size-*`) and the spacing scale (`--h-space-*`). It
does not say which of the existing semantic and component tokens read them. Many of those tokens hold a length that
equals a step, some of them a spacing, some a dimension.

## Options

1. Keep the existing tokens literal and only add the scales.
2. Reference a step from every token whose length equals one, widths, heights and icon sizes included.
3. Reference a step only where the token means the same as the scale: a font size from the type scale; a padding, gap,
   indent or gutter from the spacing scale.

## Decision

Option 3. A token references a step when it is a single length that equals one. Values between the steps and
shorthands of several lengths stay written out, as do widths, heights, icon sizes and offsets.

## Consequences

- The resolved values do not change; the CSS variable of such a token is now a `var()` of the step.
- An app that overrides a step also changes the components that reference it, and no dimension changes with it.
- A new font size or spacing token that equals a step references it; `scripts/tests/tokens-data.spec.ts` fails
  otherwise.
