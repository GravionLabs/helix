# ADR 0011: How `hx-field` wires a control and when it shows the error

- Status: proposed
- Date: 2026-11-26
- Issues: #1210, #1206
- Builds on: [ADR 0009](0009-type-scale-spacing-form-field-list-row-and-lint-preset.md)

## Context

ADR 0009 names `hx-field` and its inputs. It leaves open how `id` and the ARIA attributes reach the control, which
differs between native controls and composite ones, and when an `error` the app sets is shown.

## Options

1. The field writes the attributes into the DOM of every control, composite ones included.
2. Every control, native ones included, injects a field context and binds the attributes itself.
3. The field writes them on native controls; a composite control injects an internal context and binds them to its
   own focusable element.

For the error: show a set `error` always, or, with a form on the control, only once it is invalid and touched.

## Decision

Option 3. Angular's own bindings in a composite control would overwrite attributes written from outside, and the
native directives stay free of any knowledge of the field. The context is internal, not part of the public API;
`hx-select` is the first control that reads it, and only the control the field wires does.

With a form on the control, the field is invalid, and shows `error` or the form's message, only when the control is
invalid and touched. A reactive or template-driven form then needs no condition in the app. Without a form, a set
`error` shows at once.

## Consequences

- Inside a field an `hx-select` shows as invalid after a touch, not as soon as its signal forms value is invalid.
- Each further composite control (`hx-multi-select`, `hx-date-picker`, …) has to read the context before the field
  supports it.
- An app that wants a message on a valid control (a server answer) sets it as an error on the form.
