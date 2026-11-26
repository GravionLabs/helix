# UX review rubric

Deep dive of the [UX style guide](STYLEGUIDE.md): read it when you review a changed screen, a screenshot or a
prototype. Walk the screen with the questions below and report in the [fixed output](#output). Each question checks the
rule it links; the rule decides, not the question. Name the highest-impact friction first, then the concrete change.

A finding of this rubric is a note. It blocks only when an acceptance criterion names it
([ADR 0008](../adr/0008-ux-style-guide-a-helix-base-guide-that-app-guides-extend.md), decision 6).

## Questions

### Forms

- Does every control have a visible label, wired by `hx-field` or a `<label for>`?
  ([Field anatomy](forms.md#field-anatomy), [Controls outside `hx-field`](forms.md#controls-outside-hx-field))
- Is a placeholder only a hint, never the label or an example value? ([Placeholders](forms.md#placeholders))
- Are related fields grouped, with the gaps of the vertical rhythm?
  ([Groups](forms.md#groups), [Vertical rhythm](forms.md#vertical-rhythm))
- Is each value entered with the control for its kind, and is a path chosen with a path picker?
  ([Which control for which value](forms.md#which-control-for-which-value), [Path pickers](forms.md#path-pickers))
- Can an invalid form be submitted so that each missing field shows an error that says what to enter?
  ([Validation](forms.md#validation), [Validators](forms.md#validators))

### Dialogs

- Is a dialog used only for a decision that blocks the app, and a popover, toast or inline message otherwise?
  ([Which element for what](ux-rules.md#which-element-for-what))
- Is a modal decision an `hx-dialog` with its actions in `hxDialogFooter`? ([Components](STYLEGUIDE.md#components))
- Does the `size` of the dialog fit what it holds? ([Dialog sizes](../components/dialog.md#sizes))
- Does an action that cannot be undone ask through `HxConfirmationService` with an accept button that names it, and
  does a reversible one run and offer Undo? ([Confirm or undo](ux-rules.md#confirm-or-undo))

### Buttons

- Does the view or dialog have at most one filled primary button, and does each action have the `variant` and
  `severity` of its job? ([Button hierarchy](components.md#button-hierarchy))
- Is `danger` used only for destructive actions, never for Cancel? ([Danger](color.md#danger))
- Does each icon-only button have an `aria-label` and an `hx-tooltip` with the same text?
  ([Icon-only buttons](components.md#icon-only-buttons))
- Are several actions of one place combined with the component for that need?
  ([Several actions together](components.md#several-actions-together))
- Do the controls of a row have the size of that row? ([Button size](components.md#button-size))
- Is each control a Helix component or directive, and is a list of things to open or choose an `hx-list`?
  ([Reuse before building](components.md#reuse-before-building),
  [Which primitive replaces which raw element](components.md#which-primitive-replaces-which-raw-element),
  [Lists](components.md#lists))

### Color

- Is every color a role token or a `color-mix()` of one, with no literal and no palette step?
  ([Literals and tints](color.md#literals-and-tints))
- Do each background and its text come from the same surface role?
  ([Surfaces and their foregrounds](color.md#surfaces-and-their-foregrounds))
- Does primary mark only the affirmative action and link text? ([Primary](color.md#primary))
- Does each status show a text or icon next to its color? ([Status](color.md#status))

### Typography and spacing

- Is every font size a `--h-font-size-*` step, at most four on the screen, with body text of at least
  `--h-font-size-sm`? ([Typography and spacing](STYLEGUIDE.md#typography-and-spacing))
- Are gaps, padding, radii and shadows tokens? ([Tokens](STYLEGUIDE.md#tokens))
- Are toolbar actions in `hx-toolbar` and rows in `hx-list-row`, with density set for the whole app only?
  ([Typography and spacing](STYLEGUIDE.md#typography-and-spacing))
- Are texts in sentence case, without "please", "simply" or "just"?
  ([UX rules](STYLEGUIDE.md#ux-rules))

### Keyboard

- Is every action a native control that works from the keyboard? ([Cross-platform](STYLEGUIDE.md#cross-platform))
- Does Enter submit a form through its `type="submit"` primary button? ([Validation](forms.md#validation))
- Does a dialog focus the first control of its content, close with Escape and return the focus? Does a confirmation
  start on the reject button?
  ([Dialog accessibility](../components/dialog.md#service), [Confirm or undo](ux-rules.md#confirm-or-undo))
- Does everything focusable show the focus ring, and nothing else use it? ([Focus](color.md#focus))
- Is each shown shortcut implemented, labelled for the platform and set in `aria-keyshortcuts`?
  ([Shortcut labels](platform.md#shortcut-labels), [Ctrl and Cmd](platform.md#ctrl-and-cmd))

### States

- Does the control that starts an action disable at once, and does a longer action show a spinner, steps or progress?
  ([Feedback by duration](ux-rules.md#feedback-by-duration))
- Does every data view have a loading, an empty and an error state? ([UX rules](STYLEGUIDE.md#ux-rules))
- Does each empty or error state name the next action, also when only a part of the screen failed to load?
  ([Empty and error states](ux-rules.md#empty-and-error-states))
- Does an error the user has to read, retry or copy stay inline until it is solved, not in a toast?
  ([Which element for what](ux-rules.md#which-element-for-what))
- Do tooltips hold no text the user must read, and does no labelled control have one? ([Tooltips](ux-rules.md#tooltips))
- Does every movement have a `prefers-reduced-motion` variant? ([Motion](ux-rules.md#motion))

## Output

Report under these five headings, in this order. Write "None" under a heading with nothing to report. Name the affected
element in each finding.

### Top fixes

The three changes that would most improve the screen, the most important first.

### Friction notes

Specific problems of clutter, alignment, copy, focus or flow.

### Suggested changes

The exact change to layout, hierarchy, controls, copy or states, with the Helix component or token that carries it.

### Keyboard and speed check

Whether the main task can be done by keyboard and in few steps, with the focus where it starts and what Enter and
Escape do.

### Follow-up states (loading, empty, error, partial)

States that are missing or give the user no next action.
