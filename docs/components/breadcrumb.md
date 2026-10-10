# Breadcrumb

`hx-breadcrumb` renders the path to the current page as a `nav` landmark with an ordered list. The last item is
the current page (`aria-current="page"`); items with `routerLink` or `url` are links. It needs `@angular/router`.

```html
<hx-breadcrumb [model]="items" [home]="{ icon: 'pi pi-home', routerLink: '/' }" />
```

An item is `{ label?, icon?, routerLink?, url?, target?, disabled?, visible? }`; `icon` is the CSS classes of an
icon font. An item without a label (the home icon) gets `aria-label="Home"`. `ariaLabel` renames the landmark.

## Tokens

The look comes from the design tokens `--h-breadcrumb-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
