# Editor

> Editor groups a collection of contents in tabs.

## Import

```ts
import { Editor } from '@gravionlabs/helix/editor';
```

## Components

### Editor

Selector: `h-editor`

Editor groups a collection of contents in tabs.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the container. |
| `styleClass` | `string \| undefined` | — | Style class of the container. |
| `placeholder` | `string \| undefined` | — | Placeholder text to show when editor is empty. |
| `formats` | `string[] \| undefined` | — | Whitelist of formats to display, see [here](https://quilljs.com/docs/formats/) for available options. |
| `modules` | `object \| undefined` | — | Modules configuration of Editor, see [here](https://quilljs.com/docs/modules/) for available options. |
| `bounds` | `HTMLElement \| string \| undefined` | — | DOM Element or a CSS selector for a DOM Element, within which the editor’s p elements (i.e. tooltips, etc.) should be confined. Currently, it only considers left and right boundaries. |
| `scrollingContainer` | `HTMLElement \| string \| undefined` | — | DOM Element or a CSS selector for a DOM Element, specifying which container has the scrollbars (i.e. overflow-y: auto), if is has been changed from the default ql-editor with custom CSS. Necessary to fix scroll jumping bugs when Quill is set to auto grow its height, and another ancestor container is responsible from the scrolling.. |
| `debug` | `string \| undefined` | — | Shortcut for debug. Note debug is a static method and will affect other instances of Quill editors on the page. Only warning and error messages are enabled by default. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onEditorInit` | `EventEmitter&lt;EditorInitEvent&gt;` | Callback to invoke when the quill modules are loaded. |
| `onTextChange` | `EventEmitter&lt;EditorTextChangeEvent&gt;` | Callback to invoke when text of editor changes. |
| `onSelectionChange` | `EventEmitter&lt;EditorSelectionChangeEvent&gt;` | Callback to invoke when selection of the text changes. |
| `onEditorChange` | `EventEmitter&lt;EditorChangeEvent&gt;` | Callback to invoke when editor content changes (combines both text and selection changes). |
| `onFocus` | `EventEmitter&lt;EditorFocusEvent&gt;` | Callback to invoke when editor receives focus. |
| `onBlur` | `EventEmitter&lt;EditorBlurEvent&gt;` | Callback to invoke when editor loses focus. |

## Source

[`projects/helix/editor`](../../projects/helix/editor)
