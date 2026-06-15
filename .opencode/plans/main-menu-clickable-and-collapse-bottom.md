# Main Menu Clickable + Collapse Button at Bottom

## Issues

1. Root menu items (section headers) are not clickable — their `<a>` tag is `display: none`
2. Active root items don't show as active — `active-menuitem` only checks `isActive()`, not `hasActiveDescendant()`
3. Collapse button floats below menu content instead of being pinned to bottom
4. Collapse button icon is centered, should be right-aligned

## Changes

### 1. `menu-item.ts` — Host class binding (line 23)
```
'[class.active-menuitem]': 'isActive()'  
→ '[class.active-menuitem]': 'isActive() || hasActiveDescendant()'
```
This ensures root items get the `active-menuitem` class when any descendant matches the route.

### 2. `menu-item.scss` — Make root items clickable (lines 43-45)
Remove `> a { display: none; }` from the `.layout-root-menuitem` block.
The root item's `<a>` tag will now render with the icon, label, and submenu toggler chevron.
The `.layout-menuitem-root-text` section header label remains visible above it.

### 3. `sidebar.html` — No structural changes needed

### 4. `sidebar.scss` — Pin collapse button to bottom, right-align
- Add `position: relative` to `.layout-sidebar` (create positioning context)
  Note: already has `position: fixed`, which works as positioning context for absolute children.
- Change `.layout-sidebar-collapse-button`:
  - `position: absolute; bottom: 0.5rem; left: 1.5rem; right: 1.5rem; width: auto;`
  - `justify-content: flex-end` (right-align icon)
- Override when collapsed (`.layout-sidebar-collapsed`):
  - `left: 0.75rem; right: 0.75rem;`
- Add `padding-bottom: 4rem` to `.layout-sidebar` to prevent menu content from scrolling behind the absolute button.
  - Override for collapsed: `padding-bottom: 4rem` (same, just use a single value in the base rule)

### 5. `menu-item.spec.ts` — No changes needed
Existing tests don't test `active-menuitem` on root items with descendants.
