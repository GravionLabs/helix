# UX rules for desktop apps

The rules that apps on Helix (poimen, nixe) follow for feedback. They are short on purpose: an agent that writes UI
code checks a change against them, and a reviewer checks the same list. An app links to this page from its
`AGENTS.md`. Each rule names the Helix component or token that carries it.

## Feedback by duration

Every action answers at once. What else the user sees depends on how long the action takes.

| Duration  | What the user sees                                                     | Helix                                                                                                  |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Any       | The control that started it is disabled, so it cannot be started twice | `[disabled]`, or `[loading]` on [`hx-button`](../components/button.md)                                 |
| Under 1 s | Nothing more                                                           |                                                                                                        |
| From 1 s  | A spinner, or a changed label ("Saving…")                              | `[loading]` on `hx-button`, [`hx-progress-spinner`](../components/progress.md)                         |
| From 3 s  | Named steps ("Uploading 2 of 5") or a progress bar                     | [`hx-progress-bar`](../components/progress.md), [`hx-skeleton`](../components/skeleton.md) for content |

The visible loading state is delayed by about 200 ms. An action that ends before that shows no flash of a spinner.
Disabling the control is not delayed.

## Which element for what

| Need                                                           | Use                                                          | Helix                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Name a control                                                 | Tooltip                                                      | [`hx-tooltip`](../components/tooltip.md)                                                    |
| A small form, a few fields, no decision that blocks the app    | Popover                                                      | [`hx-popover`](../components/popover.md)                                                    |
| A decision that blocks: the app cannot go on without an answer | Dialog, and only then                                        | [`hx-dialog`](../components/dialog.md), [`HxConfirmationService`](../components/confirm.md) |
| A result that passes: saved, copied, deleted                   | Toast                                                        | [`hx-toast`](../components/toast.md), `HxMessageService`                                    |
| Text the user has to read, retry or copy                       | Inline message, next to what it is about, until it is solved | [`hx-message`](../components/message.md)                                                    |

A toast goes away by itself, so it never carries an error the user has to act on or an error text to copy. Such an
error is an inline message.

## Confirm or undo

- A **reversible** action runs at once and shows a toast with an Undo action
  (`HxMessageService.add({ …, action: { label: 'Undo', run } })`).
- An action that **cannot be undone** asks first, in a dialog whose default is Cancel: the focus starts on the reject
  button and the accept button names the action ("Delete", not "OK"), with `acceptSeverity: 'danger'`.
  `HxConfirmationService` does both.

Do not ask before a reversible action: a dialog the user always accepts teaches them to accept every dialog.

## Tooltips

- Never on a control with a visible label: the tooltip would repeat it. Icon-only buttons get one, together with
  an `aria-label`.
- Never for content the user must read. A tooltip is not reachable on touch and disappears with the pointer; text
  the user needs is an inline message or visible text.
- The shortcut goes into the tooltip: `[hxTooltipShortcut]="['Ctrl', 'K']"` (shown as [`hx-kbd`](../components/kbd.md)),
  and `aria-keyshortcuts` on the control.
- Text that is cut off with an ellipsis gets a tooltip with the full text, shown only then:
  `hxTooltipWhenTruncated`.

## Empty and error states

- An empty state and an error state both **name the next action**: "No projects yet. Create a project" with the
  button, or "The order could not be saved. Try again" with a retry. A state that only says what is wrong is not
  finished.
- Texts are in **sentence case** ("Save changes", not "Save Changes"), and do not use "please", "simply" or "just".
  Say what happened and what to do, in the fewest words.
- An error says what failed in the words of the user, not an exception text.

Carried by [`hx-message`](../components/message.md) (inline, `severity="error"`) and a button inside it for the action.

## Motion

- Every movement (slide, scale, spin, shake, slide-in of a toast or drawer) has a `prefers-reduced-motion: reduce`
  variant that removes the movement. Fades may stay.
- Durations come from the token `transition.duration` (`--h-transition-duration`, 0.2 s), not from a literal
  in a component.

Helix components follow this already (toast, drawer, progress, skeleton, carousel, message, menu); an app does the same
for its own animations:

```css
@media (prefers-reduced-motion: reduce) {
  .my-panel {
    animation: none;
    transition: opacity var(--h-transition-duration);
  }
}
```

## Checklist for a review

1. Does the control disable at once, and does a long action show a delayed spinner or progress?
2. Is each message the right element: tooltip, popover, dialog, toast, inline message?
3. Reversible: Undo toast. Irreversible: dialog with Cancel as the default.
4. No tooltip on a labelled control or with text the user must read; shortcuts in the tooltip.
5. Do empty and error states name the next action, in sentence case, without "please", "simply", "just"?
6. Does each animation have a `prefers-reduced-motion` variant?
