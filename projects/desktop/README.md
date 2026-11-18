# @gravionlabs/helix-desktop

The Helix desktop frame for Angular: activity bar, views, status bar and the platform switch (see
[ADR 0005](../../docs/adr/0005-helix-desktop-package.md)). The package is a scaffold: the components follow.

## Entry points

| Entry                              | Content                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| `@gravionlabs/helix-desktop`       | Components, view contract, platform switch. No `@tauri-apps/*`. |
| `@gravionlabs/helix-desktop/tauri` | The Tauri bindings. Only this entry may import `@tauri-apps/*`. |

`pnpm lint:no-tauri` fails on an `@tauri-apps/*` import outside the `tauri` entry.

## Peer dependencies

`@angular/core`, `@angular/common`, `@angular/cdk` (`>=22`) and `@gravionlabs/helix-ui`.

## Styles

```css
@import "@gravionlabs/helix-ui/tokens.css";
@import "@gravionlabs/helix-desktop/styles.css";
```

The styles read only `--h-*` tokens, so light and dark follow `HxTheme`.
