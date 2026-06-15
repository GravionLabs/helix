# Badge Consolidation & Alignment Fixes

## Files to move
- `topbar/badges/dark-mode-badge.ts` → `badge/dark-mode-badge.ts`
- `topbar/badges/dark-mode-badge.spec.ts` → `badge/dark-mode-badge.spec.ts`
- `topbar/badges/configurator-badge.ts` → `badge/configurator-badge.ts`
- `topbar/badges/configurator-badge.spec.ts` → `badge/configurator-badge.spec.ts`
- `topbar/badges/mobile-menu-badge.ts` → `badge/mobile-menu-badge.ts`
- `topbar/badges/mobile-menu-badge.spec.ts` → `badge/mobile-menu-badge.spec.ts`
- Delete `topbar/badges/` directory

## dark-mode-badge.ts (2 fixes)
1. Fix import: `../../../store/layout.store` → `../../store/layout.store`
2. Fix ngClass race condition:
   - Before: `'pi pi-moon': cond, 'pi pi-sun': !cond`
   - After: `pi: true, 'pi-moon': cond, 'pi-sun': !cond`
3. Add host styling for vertical centering:
   ```
   host: { style: 'display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%;' }
   ```

## configurator-badge.ts (2 fixes)
1. Fix import: `../../configurator/configurator` → `../configurator/configurator`
2. Add inline styling to `<div class="relative">`:
   ```
   style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem;"
   ```

## mobile-menu-badge.ts (1 fix)
1. Add host styling matching dark-mode-badge:
   ```
   host: { style: 'display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%;' }
   ```

## sidebar.html (1 fix)
Fix ngClass race condition on collapse toggle icon:
- Before: `'pi pi-angle-double-left': !collapsed, 'pi pi-angle-double-right': collapsed`
- After: `pi: true, 'pi-angle-double-left': !collapsed, 'pi-angle-double-right': collapsed`

## topbar.html (1 fix)
Move `<helix-environment-badge>` after `{{ appTitle() }}` in the logo `<a>` tag.

## topbar.ts (1 fix)
Update imports:
- `./badges/dark-mode-badge` → `../badge/dark-mode-badge`
- `./badges/configurator-badge` → `../badge/configurator-badge`
- `./badges/mobile-menu-badge` → `../badge/mobile-menu-badge`

## public-api.ts (1 fix)
Update export paths:
- `topbar/badges/dark-mode-badge` → `badge/dark-mode-badge`
- `topbar/badges/configurator-badge` → `badge/configurator-badge`
- `topbar/badges/mobile-menu-badge` → `badge/mobile-menu-badge`
