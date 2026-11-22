# Code editor

`hx-code-editor` from `@gravionlabs/helix-code` hosts a CodeMirror editor in an Angular template: text in and out, the language by file path, the Helix theme and highlighting, and `extensions` for the features of the app. It needs the optional peers `@codemirror/state`, `@codemirror/view`, `@codemirror/commands`, `@codemirror/language` and `@lezer/highlight`, plus `@codemirror/language-data` for the default language list.

```html
<hx-code-editor aria-label="Source" path="src/app/app.ts" [(value)]="text" />
```

## Inputs and outputs

| Name                            | Type                   | Description                                                                     |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| `value` (model)                 | `string`               | The text. `valueChange` fires on user edits only, not when the binding changes. |
| `path`                          | `string`               | A file name or path; it selects the language. Empty or unknown: plain text.     |
| `readOnly`                      | `boolean`              | The text cannot be edited.                                                      |
| `lineNumbers`                   | `boolean`              | Line number gutter; default `true`.                                             |
| `lineWrapping`                  | `boolean`              | Wrap long lines; default `false`.                                               |
| `extensions`                    | `readonly Extension[]` | Extra CodeMirror extensions (completion, search, lint, key bindings).           |
| `disabled`, `invalid`           | `boolean`              | Form state: `disabled` also blocks editing; `invalid` marks the border.         |
| `touch`                         | `output<void>`         | The editor lost focus.                                                          |
| `aria-label`, `aria-labelledby` | `string`               | The accessible name; it is moved onto the editable element.                     |

Methods: `view()` returns the `EditorView` (`null` before the first render), `focus()` moves the focus into the editor.

## Behaviour

- The view is created once. Changing `value`, `path`, `readOnly`, `lineNumbers`, `lineWrapping` or `extensions` dispatches to the running view (compartments); the scroll position stays.
- The languages come from the token `HX_CODE_LANGUAGES` and load as lazy chunks; a late result of an earlier `path` is ignored.
- The view is destroyed with the component.

## Forms

Like `hx-select`, it implements `ControlValueAccessor` and `FormValueControl`: use it with `ngModel`, `formControl` or `[formField]`.

## Accessibility

CodeMirror renders a `role="textbox"` element; give the host an `aria-label` or `aria-labelledby`. Tab inserts no tab character by default (the focus moves on), as the WAI-ARIA guidance for code editors suggests.
