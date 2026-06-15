# Accordion Menu + Badge Cursor + Root Icons

## 1. Accordion behavior — only one root expanded at a time
**Problem:** Each root menu item has its own `isManuallyExpanded` signal. Clicking a second root doesn't collapse the first.

**Solution:** Move manual expansion tracking into LayoutStore as a shared value.

### `layout.store.ts`
Add state + method:
```ts
// initialState
expandedRoot: null,

// withMethods
setExpandedRoot(key: string | null) {
  patchState(store, { expandedRoot: key });
},
```

### `menu-item.ts`
Replace local `isManuallyExpanded` signal with a computed that reads from store:
```ts
itemKey = computed(() => this.fullPath() ?? this.item()?.label ?? '');

// Remove: isManuallyExpanded = signal(false);
// Replace with:
isManuallyExpanded = computed(() => this.store.expandedRoot() === this.itemKey());
```

Update `itemClick`:
```ts
if (this.hasChildren()) {
  if (this.isExpanded()) {
    this.store.setExpandedRoot(null);
    this.store.setActivePath(null);
  } else {
    this.store.setExpandedRoot(this.itemKey());
    this.store.setActivePath(this.fullPath() ?? this.item()?.label ?? '');
    this.store.setMenuHoverActive(true);
  }
}
```

Remove `isManuallyExpanded.set(...)` calls.

## 2. Cursor pointer on darkmode/configurator badges
### `dark-mode-badge.ts`
Add `cursor: pointer` to host style or component styles.

### `configurator-badge.ts`
Add `cursor: pointer` to host styles.

## 3. Base badge component (deferred — see rationale)
Common host styles across all badges: `display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; cursor: pointer;` + `:hover { background-color: var(--surface-hover); }`.

These 3 badges all have different templates (dark-mode has `<button>`, configurator has `<div>+<button>+<helix-configurator>`, alert has `<button>+<div>`). A base component would use content projection but doesn't buy much over just keeping the host styles consistent. I'll ensure all 3 share the exact same host styling instead.

## 4. Add icons to root menu items
### `projects/demo/src/app/layout/menu.model.ts`
```ts
{ label: 'Home',         icon: 'pi pi-fw pi-home',       items: [...] }
{ label: 'UI Components', icon: 'pi pi-fw pi-th-large',   items: [...] }  // new
{ label: 'Pages',         icon: 'pi pi-fw pi-briefcase',  items: [...] }  // already has icon
{ label: 'Hierarchy',     icon: 'pi pi-fw pi-sitemap',    items: [...] }
{ label: 'Get Started',   icon: 'pi pi-fw pi-star',       items: [...] }
```

## Files changed
| File | Change |
|---|---|
| `layout.store.ts` | Add `expandedRoot` state + `setExpandedRoot()` method |
| `layout.models.ts` | Add `expandedRoot` to `LayoutState` type (if needed) |
| `menu-item.ts` | Replace local `isManuallyExpanded` signal with store-based computed |
| `dark-mode-badge.ts` | Add `cursor: pointer` to host |
| `configurator-badge.ts` | Add `cursor: pointer` to host |
| `menu.model.ts` | Add `icon` to Home, UI Components, Hierarchy, Get Started |
