# Toast

`hx-toast` shows short messages that go away. Put one in the root component and send messages with
`HxMessageService`.

```html
<hx-toast position="top-right" />
<hx-toast key="form" position="bottom-center" />
```

```ts
readonly messages = inject(HxMessageService);
this.messages.add({ severity: 'success', summary: 'Saved', detail: 'The order was saved.' });
this.messages.add({ severity: 'error', summary: 'Failed', sticky: true, key: 'form' });
this.messages.clear('form');
```

`add({ severity, summary, detail, life, sticky, closable, key })` returns the id of the message; `remove(id)` and
`clear(key?)` take messages away. `life` is 3000 ms by default, `sticky` keeps the message until it is closed,
`closable` (default `true`) shows the close button.

| Input      | Type                                                                                    | Default       | Description                                 |
| ---------- | --------------------------------------------------------------------------------------- | ------------- | ------------------------------------------- |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'center' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-right'` | Where the stack sits.                       |
| `key`      | `string`                                                                                |               | Show only messages sent with this key (without a key: those sent without). |

- **Accessibility:** every message is a live region: `role="status"` with `aria-live="polite"` for info, success,
  secondary and contrast; `role="alert"` with `aria-live="assertive"` for warn and error. The close button is named.
  The timer of a message pauses while the pointer or the focus is on it, so it is not removed while someone reads it or
  reaches for its close button. Motion stops under `prefers-reduced-motion`.

## Tokens

The look comes from the design tokens `--h-toast-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
