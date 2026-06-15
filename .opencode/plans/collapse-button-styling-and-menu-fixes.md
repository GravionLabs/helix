# Collapse Button + Badge Hover + Menu Alignment + Active Indicator

## 1. Collapse button — render like a badge
**File:** `sidebar.scss`
- Remove `border: 1px solid ...`
- Change `border-radius` from `var(--content-border-radius)` to `50%`
- Set `width: 2.5rem; height: 2.5rem` (like topbar badges)
- Change `justify-content: flex-end` to `justify-content: center` (icon centered within circle)
- Add `background-color: transparent` (remove implicit surface-overlay bg)
- Add `&:hover { background-color: var(--surface-hover); }`
- Icon styling: `<i>` inside button should be centered, no extra margin

## 2. Darkmode & configurator badges — add hover effect
**File:** `dark-mode-badge.ts`
The host has `display: inline-flex; width: 2.5rem; height: 2.5rem; border-radius: 50%` but no hover background. Add component-level styles:
```ts
styles: [`
  :host(:hover) { background-color: var(--surface-hover); }
`]
```

**File:** `configurator-badge.ts`
The wrapper `<div>` has the sizing but no hover. Either add the hover to the wrapper div or to `:host`. Simpler: add inline style `transition: background-color var(--element-transition-duration)` to wrapper, or add component styles similar to dark-mode.

## 3. Menu item alignment
**File:** `menu-item.scss`

Root items need to be less indented than children:
- Root `<a>`: `padding: 0.75rem 1rem 0.75rem 0` (remove left padding)
- Root font: slightly larger/weight
- Children already have `margin-left: 1rem` from the non-root submenu rules — so they'll naturally indent relative to root

Add root-specific styles:
```scss
:host(.layout-root-menuitem) {
  > a {
    padding: 0.75rem 1rem 0.75rem 0;
    font-weight: 600;
    font-size: 1.05rem;
  }
}
```

Collapsed override keeps icon centered:
```scss
:host(.layout-sidebar-collapsed) > a {
  padding: 0.75rem;
  ...
}
```

## 4. Active menu item indicator
**File:** `menu-item.scss`

Add visual distinction for `.active-menuitem`:
```scss
:host(.active-menuitem) {
  > a {
    color: var(--primary-color);
    font-weight: 700;
  }

  > a .layout-menuitem-icon {
    color: var(--primary-color);
  }
}
```
The chevron rotation is already handled by the existing `:host(.active-menuitem) > a .layout-submenu-toggler` rule.
