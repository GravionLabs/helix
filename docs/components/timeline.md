# Timeline

`hx-timeline` shows events along a line, as an ordered list.

```html
<hx-timeline [value]="events" align="alternate">
  <ng-template hxTimelineContent let-event>{{ event.status }}</ng-template>
  <ng-template hxTimelineOpposite let-event>{{ event.date }}</ng-template>
  <ng-template hxTimelineMarker let-event><span class="pi pi-check"></span></ng-template>
</hx-timeline>
```

| Input    | Type                                | Default      | Description                                  |
| -------- | ----------------------------------- | ------------ | -------------------------------------------- |
| `value`  | `unknown[]`                         | `[]`         | The events, handed to the templates.         |
| `align`  | `'left' \| 'right' \| 'alternate'`   | `'left'`     | Which side of the line the content is on.    |
| `layout` | `'vertical' \| 'horizontal'`        | `'vertical'` | Direction of the line.                       |

The templates `hxTimelineContent`, `hxTimelineOpposite` and `hxTimelineMarker` receive the event (`let-event`) and its
index (`let-index="index"`). Without a marker template the line shows a ring with a dot.

- **Align:** vertical, `left` puts the content right of the line and the opposite text left of it, `right` the other
  way round, `alternate` switches with every event. Horizontal, `left` puts the content below the line, `right`
  above it.
- **Accessibility:** an `<ol>` of `<li>`s; the separator (marker and connector) is `aria-hidden`, so put whatever must
  be read, such as the date and the status, in the content or opposite templates.

## Tokens

The look comes from the design tokens `--h-timeline-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
