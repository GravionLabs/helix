# Platform

Deep dive of the [UX style guide](STYLEGUIDE.md): read it when you show or handle a keyboard shortcut, write CSS for a
desktop app, or change a Tauri app that runs on Linux (WebKitGTK) or Windows (WebView2). The platform switch is that
of [Helix Desktop](../HELIX-DESKTOP.md) ([ADR 0005](../adr/0005-helix-desktop-package.md)), key caps are
[`hx-kbd`](../components/kbd.md) ([ADR 0006](../adr/0006-key-cap-component-and-tooltip-shortcut.md)).

## Platform switch

- A Tauri app on `@gravionlabs/helix-desktop` has `providePlatform()` of `@gravionlabs/helix-desktop/tauri` in its
  bootstrap providers. It sets `data-platform` to `macos`, `windows`, `linux`, `ios`, `android` or `web`.
- TypeScript branches on the platform with `getHxPlatform()`, CSS with `:root[data-platform='…']`. The app reads no
  `navigator.userAgent` or `navigator.platform` for this.
- The shell is picked as in [HxMobileShell](../HELIX-DESKTOP.md#hxmobileshell-and-hxbottombar), never by window width.

## Ctrl and Cmd

"Apple" below means `getHxPlatform()` returns `macos` or `ios`. A browser build returns `web` on every operating
system, so the switch decides this for Tauri apps only.

| Key     | Label in `keys` on Apple | Label elsewhere | `aria-keyshortcuts` |
| ------- | ------------------------ | --------------- | ------------------- |
| Command | `⌘`                      | none            | `Meta`              |
| Control | `⌃`                      | `Ctrl`          | `Control`           |
| Alt     | `⌥`                      | `Alt`           | `Alt`               |
| Shift   | `⇧`                      | `Shift`         | `Shift`             |

- The main modifier of an app shortcut is Command on Apple and Control elsewhere. The label, `aria-keyshortcuts` and
  the key handler (`event.metaKey` or `event.ctrlKey`) of one shortcut take it from the same `getHxPlatform()` value.
- `keys` lists the modifiers before the key; on Apple in the order `⌃`, `⌥`, `⇧`, `⌘`.
- The app sets no `separator` on `hx-kbd`: the default is none on macOS and `+` elsewhere.

```ts
const apple = ['macos', 'ios'].includes(getHxPlatform());
const searchKeys = [apple ? '⌘' : 'Ctrl', 'K'];
const searchAria = apple ? 'Meta+K' : 'Control+K';
```

## Shortcut labels

- A tooltip shows a shortcut through `hxTooltipShortcut`, every other place (palette, help, empty state) through
  `hx-kbd`. No shortcut is written into a text, a label or a `title`.
- Only an implemented shortcut is shown: each shown `keys` array has a handler that runs the action on that platform.
- The control that runs the action has `aria-keyshortcuts` with the names of the table.

```html
<button
  hx-button
  iconOnly
  aria-label="Search"
  hx-tooltip="Search"
  [hxTooltipShortcut]="searchKeys"
  [attr.aria-keyshortcuts]="searchAria"
  (click)="search()"
>
  <span class="hx-button-icon pi pi-search" aria-hidden="true"></span>
</button>
```

## WebKitGTK and WebView2

A Tauri app renders in WebKitGTK on Linux, in WebView2 on Windows and in WKWebView on macOS. A change of app CSS or of
a shortcut can look right in one and wrong in another.

### Font rendering

- An app with the `helix-shell` stylesheet loads the Inter font file (`@fontsource-variable/inter`) that
  `--helix-font-sans` names first. Without it each system draws another fallback font.
- Font smoothing is set by the `globals.css` of `helix-shell`; app CSS sets no `-webkit-font-smoothing` and no
  `text-rendering`. `-webkit-font-smoothing` changes nothing on Linux and Windows.

### Scrollbars and native controls

- `tokens.css` sets `color-scheme` for light and dark, so the scrollbars the web view draws follow the theme. App CSS
  sets no `color-scheme`.

Whether a scrollbar takes layout space differs between the web views and the system settings.

### Focus

Helix controls draw their own ring, and the rules for an element of the app that takes focus are in
[Focus](color.md#focus). They hold on every web view.

### Backdrop blur

- App CSS sets no `backdrop-filter`. The blur of an overlay is that of its component token (`--h-toast-blur`,
  `--h-image-toolbar-blur`).
- Older WebKit versions read only `-webkit-backdrop-filter`, so a blur may not show on Linux. Text on an overridden
  `--h-toast-*` background keeps at least 4.5:1 without the blur.

## Known quirks

Found in the Helix apps. They are notes, not rules.

| Web view  | Quirk                                                                                                                                                     | Found in              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| all       | A release build renders without component and grid styles unless the [content security policy](../HELIX-DESKTOP.md#tauri-content-security-policy) is set. | helix-desktop         |
| all       | `tauri dev` applies no policy while `devCsp` is `null`, so a policy problem shows only in an installed build.                                             | helix-desktop, gantry |
| all       | The Enter that ends an IME composition has `isComposing` or `keyCode` 229; a key handler that tests neither saves too early.                              | poimen                |
| all       | The drag-and-drop events of Tauri give the position in physical pixels, not in CSS pixels.                                                                | poimen                |
| WebKit    | Events do not reach a sandboxed `iframe` without `allow-scripts` ([WebKit bug 218086](https://bugs.webkit.org/show_bug.cgi?id=218086)).                   | nixe                  |
| WebKitGTK | Printing ignores the CSS `@page` size and margin; the GTK page setup sets them.                                                                           | nixe                  |
| WebKitGTK | The headless PDF export job in CI (`xvfb-run`) runs with `WEBKIT_DISABLE_DMABUF_RENDERER=1`.                                                              | nixe                  |
| WebView2  | Printing lays out the CSS `@page` size on the paper of the print settings.                                                                                | nixe                  |
| WebView2  | A Mermaid flowchart exported from the command line was laid out far too wide on a CI runner.                                                              | nixe                  |
| WKWebView | The native menu owns the Command shortcuts; a key handler of the page that also takes them runs the action twice.                                         | poimen                |

## Not carried yet

These have no Helix carrier and are therefore no rule yet:

- Resolving Command or Control for labels, `aria-keyshortcuts` and handlers, also in a browser build:
  [#1245](https://github.com/GravionLabs/helix/issues/1245).
- A shortcut label on an `hx-menu` or `hx-menubar` item:
  [#1259](https://github.com/GravionLabs/helix/issues/1259).
- The width and color of scrollbars: [#1260](https://github.com/GravionLabs/helix/issues/1260).
- A UI font for apps without the `helix-shell` stylesheet:
  [#1247](https://github.com/GravionLabs/helix/issues/1247).
