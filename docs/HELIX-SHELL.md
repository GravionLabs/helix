# `@gravionlabs/helix-shell` — Component API Reference

> All inputs use the Angular 17+ `input()` signal API and ship with defaults, so adding a new input is never a breaking change for consumers.

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Layout Components](#layout-components)
   - [HelixAppLayout](#helixapplayout)
   - [HelixTopbar](#helixtopbar)
   - [HelixStatusBar](#helixstatusbar)
   - [HelixFooter](#helixfooter)
   - [HelixNavRail](#helixnavrail)
   - [Internal Layout Components](#internal-layout-components)
4. [Routing Utilities](#routing-utilities)
   - [helixRoutesFrom](#helixroutesfrom)
   - [helixMenuLinksFrom](#helixmenulinksfrom)
   - [helixBreadcrumbsFromRoutes](#helixbreadcrumbsfromroutes)
5. [Layout Store](#layout-store)
6. [Auth Pages](#auth-pages)
   - [HelixLogin](#helixlogin)
   - [HelixError](#helixerror)
   - [HelixAccess](#helixaccess)
   - [authRoutes](#authroutes)
7. [Other Pages](#other-pages)
   - [HelixEmpty](#helixempty)
   - [HelixNotfound](#helixnotfound)
8. [Landing Page Components](#landing-page-components)
   - [HelixLanding](#helixlanding)
   - [HelixTopbarWidget](#helixtopbarwidget)
   - [HelixHeroWidget](#helixherowidget)
   - [HelixFeaturesWidget](#helixfeatureswidget)
   - [HelixHighlightsWidget](#helixhighlightswidget)
   - [HelixPricingWidget](#helixpricingwidget)
   - [HelixFooterWidget](#helixfooterwidget)
9. [UI Components](#ui-components)
   - [HelixBadge](#helixbadge)
   - [HelixEnvironmentBadge](#helixenviromentbadge)
   - [HelixPageHeader](#helixpageheader)
   - [HelixStatCard](#helixstatcard)
10. [Form Infrastructure](#form-infrastructure)
    - [HelixFormField](#helixformfield)
11. [Interfaces](#interfaces)
    - [HelixRouteMenuItem](#helixroutemenuitem)

---

## Installation

```bash
npm install @gravionlabs/helix-shell
```

Peer dependencies: `@angular/core >=22`, `@angular/router >=22`, `@ngrx/signals >=21`,
`@gravionlabs/helix-ui >=0.1.0` (and its own peers, `@angular/cdk` and `@angular/forms`), `primeicons >=7`.

The shell draws its buttons, fields, breadcrumb and tooltips with [`@gravionlabs/helix-ui`](HELIX-UI.md), so the
app loads its styles and tokens next to the shell styles:

```css
@import "@gravionlabs/helix-ui/styles.css";
@import "@gravionlabs/helix-ui/tokens.css";
```

Dark mode, the primary colour and the surface are switched by the theme service of helix-ui, which the layout
store and the configurator use. Provide it once in the application config:

```ts
// app.config.ts
import { provideHxTheme } from '@gravionlabs/helix-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideHxTheme({ storageKey: 'my-app-theme', viewTransition: true })],
};
```

Without `provideHxTheme` the service still works with its defaults (light or the system setting, nothing
remembered); the options are described in [Theming](HELIX-UI.md#theming). The configurator offers the primary
colours and surfaces of that service and the menu mode; there is no longer a choice between Aura, Lara and Nora
presets.

---

## Quick Start

```ts
// app.component.ts
import { Component } from '@angular/core';
import { HelixAppLayout, type HelixRouteMenuItem } from '@gravionlabs/helix-shell';

const MENU: HelixRouteMenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'] },
  { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HelixAppLayout],
  template: `<helix-app-layout appTitle="My App" [menu]="menu" />`,
})
export class AppComponent {
  menu = MENU;
}
```

---

## Layout Components

### HelixAppLayout

**Selector:** `<helix-app-layout>`  
**File:** `projects/shell/src/lib/layout/components/app-layout/app-layout.ts`

Top-level shell that composes the topbar, nav rail, footer, and router outlet into a full application layout. Forwards `appTitle` to `HelixTopbar`.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `appTitle` | `string` | `'Helix'` | Application title forwarded to `HelixTopbar` |
| `menu` | `HelixRouteMenuItem[]` | `[]` | Navigation menu model. Overrides route data when provided |
| `topbarItems` | `HelixTopbarItem[]` | `darkmode`, `configurator`, `mobile` | Topbar config items. Overrides the default items when provided |
| `topbarActions` | `HelixTopbarAction[]` | `calendar`, `inbox`, `profile` | Topbar dropdown action buttons. Provide `command` callbacks to handle clicks |
| `brandIcon` | `string` | — | Nav-rail brand icon: inline SVG (`<svg>…</svg>`) or URL to an SVG file. Falls back to the default helix icon |
| `navStyle` | `'sections' \| 'tree'` | `'sections'` | How `menu` maps onto the rail: top-level items with children as always-open section headings (`'sections'`), or as expandable folders (`'tree'`). See [`helixNavGroupsFromMenu`](#helixnavgroup) |
| `navGroups` | `HelixNavGroup[]` | — | Explicit nav groups; win over the mapped `menu` |

#### Example

```html
<helix-app-layout
  appTitle="Gravion Portal"
  [menu]="myMenu"
  [topbarItems]="myItems"
  [topbarActions]="myActions"
  brandIcon="/assets/logo.svg"
/>
```

---

### HelixTopbar

**Selector:** `<helix-topbar>`  
**File:** `projects/shell/src/lib/layout/components/topbar/topbar.ts`

Application header bar. Renders a menu toggle, breadcrumb trail on the left, and configurable action buttons on the right.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `appTitle` | `string` | `'Helix'` | Application name |
| `topbarActions` | `HelixTopbarAction[]` | 3 icon buttons (calendar, inbox, profile) | Action buttons rendered in the right-side dropdown |
| `breadcrumbs` | `HxMenuItem[]` | Derived from route data | Breadcrumb trail. Falls back to route `data['breadcrumb']` resolution |
| `items` | `HelixTopbarItem[]` | `darkmode`, `configurator`, `mobile` | Configuration items rendered in the right action cluster |

#### Content Slots

| Slot | Selector | Description |
|------|----------|-------------|
| End | `[helixTopbarEnd]` | Content rendered to the right of the action buttons |

#### Layout

The topbar is split into two sections:
- **Left (`layout-topbar-start`)**: Menu toggle button followed by the breadcrumb with a home icon
- **Right (`layout-topbar-end`)**: Config menu (dark mode, configurator, alerts) and action buttons

#### Example

```html
<helix-topbar appTitle="My App" [topbarActions]="myActions" />
```

```ts
myActions: HelixTopbarAction[] = [
  { icon: 'pi pi-bell', label: 'Notifications', command: () => this.openNotifications() },
  { icon: 'pi pi-user', label: 'Profile',        command: () => this.openProfile() },
];
```

---

### HelixStatusBar

**Selector:** `<helix-status-bar>`  
**File:** `projects/shell/src/lib/layout/components/status-bar/status-bar.ts`

Thin full-bleed status bar at the bottom of the application layout. Displays brand, environment badge, note, and version labels. Background color is determined by the `tone` input.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `brand` | `string` | `''` | Brand name displayed on the left |
| `environment` | `string \| undefined` | `undefined` | Environment label (e.g. "staging", "production"). Rendered as an uppercase pill |
| `note` | `string \| undefined` | `undefined` | Optional note text (e.g. "Build #1234") |
| `versions` | `HelixStatusBarVersion[]` | `[]` | Version labels displayed on the right: `{ label: string, value: string }` |
| `tone` | `HelixStatusBarTone` | `'neutral'` | Background tone: `'staging'` (amber), `'production'` (dark), `'success'` (green), `'danger'` (red), `'neutral'` (gray) |
| `height` | `string` | `'var(--helix-status-bar-height, 3rem)'` | Bar height |

#### Example

```html
<helix-status-bar
  brand="MyApp"
  environment="staging"
  note="Build #456"
  tone="staging"
  [versions]="[
    { label: 'UI', value: '2.1.0' },
    { label: 'API', value: '3.0.1' },
  ]"
/>
```

#### Tones

| Tone | Background | Use case |
|------|-----------|----------|
| `staging` | Amber | Staging / QA environment |
| `production` | Dark (surface-800) | Production environment |
| `success` | Green | All-clear status |
| `danger` | Red | Alert / error status |
| `neutral` | Gray | Default / unknown |

---

### HelixFooter

**Selector:** `<helix-footer>`  
**File:** `projects/shell/src/lib/layout/components/footer/footer.ts`

Application footer with optional multi-column link layout and a branded copyright line.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `brandName` | `string` | `'SAKAI'` | Brand name shown in the copyright line |
| `brandUrl` | `string` | `'https://gravionlabs.github.io/helix/'` | URL the brand name links to |
| `columns` | `HelixFooterColumn[]` | `[]` | Optional link columns rendered side-by-side. Uses the same [`HelixFooterColumn`](#helixfootercolumn) model |

#### Content Slots

| Slot | Selector | Description |
|------|----------|-------------|
| Start | `[gvFooterStart]` | Custom content rendered before the link columns |

#### Example

```html
<helix-footer
  brandName="Gravion"
  brandUrl="https://gravion.io"
  [columns]="footerColumns">
  <span gvFooterStart>© 2024 Gravion GmbH</span>
</helix-footer>
```

```ts
footerColumns: HelixFooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', url: '/features' },
      { label: 'Pricing',  url: '/pricing' },
    ],
  },
];
```

---

### HelixNavRail

**Selector:** `<helix-nav-rail>`  
**File:** `projects/shell/src/lib/layout/components/nav-rail/nav-rail.ts`

Branded side-navigation rail: gradient surface (theme-aware — "Harbor Tint" light
/ a neutral dark gradient that aliases the app's own dark-mode surface tokens
(`--surface-card`/`--surface-ground`), so the rail matches the panels and body
around it instead of an invented hue), a pill active state with a teal accent
bar, expandable submenus, and collapse-to-icons. Wired into `HelixAppLayout` in
place of the old
`HelixSidebar`/`HelixMenu`. Items reuse `HelixRouteMenuItem` (the same shape
consumed by `helixMenuLinksFrom`/`helixRoutesFrom`) — route-driven active state
and breadcrumbs keep working unchanged.

Expandable items (any item with children that is not lifted into a section — every top-level
folder in `navStyle="tree"`, deeper levels in `'sections'`) render as a clickable row with a
chevron (right when closed, down when open) and a subtle indent guide for the children.
Several items can be open at once (`LayoutStore.expandedKeys()`); the group holding the
active route opens automatically on navigation and can still be collapsed by the user.

Keyboard: Tab reaches every link; `ArrowDown`/`ArrowUp` move between visible links;
`Enter`/`Space` toggle an expandable item (also `ArrowRight` to open, `ArrowLeft` to
close). Expandable items expose `aria-expanded`; the active link has `aria-current="page"`.

**Collapsing.** On desktop (> 991px) the rail's own toggle (bottom of the rail) collapses it to
icons and back — it is the only collapse control; the topbar hamburger is hidden there in
`static` menu mode. At ≤ 991px the rail is a drawer: the hamburger opens it with a mask, and
a click outside or a navigation closes it (the drawer always shows labels). The collapsed
state is remembered in `localStorage` (reads/writes are guarded, so it works without storage).

**Collapsed rail.** Links show a tooltip with their label. A section that has an `icon`
(`helixNavGroupsFromMenu` copies it from the top-level item) becomes a single icon, and any
expandable item opens its children in a flyout on hover and on keyboard focus (also `Enter`,
`Space` or `ArrowRight`); `Escape`, leaving the item, or navigating closes it, and it is
kept inside the viewport. Sections without an icon list their items directly.

The rail's brand icon is customizable via the `brandIcon` input — pass an inline SVG
(`<svg>…</svg>`) or a URL to an SVG file. Falls back to the default helix icon when
not provided. The app title (`appTitle`) renders alongside regardless.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `HelixNavGroup[]` | `[]` | Grouped navigation model — each group has an optional uppercase `section` label and a `HelixRouteMenuItem[]` of items |
| `appTitle` | `string` | `'Helix'` | Application title shown in the brand area. Hidden when nav is collapsed |
| `brandIcon` | `string` | — | Brand icon: inline SVG (`<svg>…</svg>`) or URL to an SVG file. Falls back to the default hardcoded icon |

#### `HelixNavGroup`

```ts
interface HelixNavGroup {
  section?: string;             // uppercase group label; omit for an unlabeled group
  items: HelixRouteMenuItem[];
}
```

Use `helixNavGroupsFromMenu(items: HelixRouteMenuItem[], style: 'sections' | 'tree' = 'sections'): HelixNavGroup[]`
to adapt an existing flat `HelixRouteMenuItem[]` tree (as used by `HelixAppLayout`'s `menu`
input) into the shape `HelixNavRail` expects:

- **`'sections'`** (default) — every top-level item with children becomes an uppercase
  section heading (its icon is not shown) with its children listed directly beneath it,
  always visible. Consecutive top-level items without children form one unlabeled group.
  Deeper levels (a child that itself has children) still expand inline.
- **`'tree'`** — the whole list is one unlabeled group, so each top-level item with
  children renders as an expandable folder.

> **Changed default:** menus with nested items used to render as collapsed folders. Pass
> `navStyle="tree"` to keep that look.

Construct `HelixNavGroup[]` by hand (and pass it as `navGroups`) for full control.

#### Example

```ts
import { helixNavGroupsFromMenu, type HelixRouteMenuItem } from '@gravionlabs/helix-shell';

const menu: HelixRouteMenuItem[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
      { label: 'Analytics', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/analytics'] },
    ],
  },
];

const navGroups = helixNavGroupsFromMenu(menu); // 'sections': OVERVIEW → Dashboard, Analytics
const treeGroups = helixNavGroupsFromMenu(menu, 'tree'); // Overview folder
```

```html
<helix-app-layout [menu]="menu" navStyle="sections" brandIcon="/assets/logo.svg" />
```

---

### Internal Layout Components

The following components are exported for completeness but have **no public inputs**
beyond what's listed here. They are orchestrated internally by `HelixAppLayout`.

| Component | Selector | Purpose |
|-----------|----------|---------|
| `HelixNavRailItem` | `[helix-nav-rail-item]` | Recursive item renderer used by `HelixNavRail` |
| `HelixConfigurator` | `<helix-configurator>` | Theme/layout configuration panel |
| `HelixFloatingConfigurator` | `<helix-floating-configurator>` | Floating toggle button for the configurator |

---

## Routing Utilities

Built-in helpers for deriving Angular routes, menu link models, and breadcrumbs from a single `HelixRouteMenuItem[]` tree — keeping route configuration and navigation menus in sync.

### helixRoutesFrom

**File:** `projects/shell/src/lib/layout/route-menu.model.ts`

Converts a `HelixRouteMenuItem` tree into Angular `Routes` for use with the Router.

```ts
import { helixRoutesFrom, type HelixRouteMenuItem } from '@gravionlabs/helix-shell';

const menu: HelixRouteMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    path: 'settings',
    breadcrumb: 'Settings',
    component: SettingsComponent,
  },
];

export const appRoutes: Routes = helixRoutesFrom(menu);
```

Behaviour:
- Items with `path` + `component` or `loadChildren` generate a route entry.
- Items without `path` (visual-only section headers) are skipped, but their children are still recursed.
- The `breadcrumb` value is injected into `route.data['breadcrumb']`.
- Nested `items` under a routable item become child routes.
- Route guards (`canActivate`) and lazy loading (`loadChildren`) are carried through.

**Returns:** `Routes`

---

### helixMenuLinksFrom

**File:** `projects/shell/src/lib/layout/route-menu.model.ts`

Recursively copies a `HelixRouteMenuItem[]` tree and auto-populates `routerLink` from each item's `path`, relative to a `basePath`.

```ts
import { helixMenuLinksFrom, type HelixRouteMenuItem } from '@gravionlabs/helix-shell';

const menu: HelixRouteMenuItem[] = [
  { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', path: 'formlayout' },
  { label: 'Input',       icon: 'pi pi-fw pi-check-square', path: 'input' },
];

const links = helixMenuLinksFrom(menu, '/uikit');
// → routerLink: ['/uikit/formlayout'], routerLink: ['/uikit/input']
```

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `items` | `HelixRouteMenuItem[]` | Source menu items |
| `basePath` | `string` | Absolute base path prefix |

**Returns:** `HelixRouteMenuItem[]`

---

### helixBreadcrumbsFromRoutes

**File:** `projects/shell/src/lib/layout/breadcrumb-utils.ts`

Builds a breadcrumb trail from the current Angular `ActivatedRoute` tree. Reads the `breadcrumb` key from each route's `data` and accumulates URL segments.

```ts
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { helixBreadcrumbsFromRoutes } from '@gravionlabs/helix-shell';

const route = inject(ActivatedRoute);
const crumbs = helixBreadcrumbsFromRoutes(route);
```

Where `breadcrumb` can be a static string or a function:
```ts
{
  path: 'users/:id',
  data: { breadcrumb: (snapshot) => `User #${snapshot.params['id']}` },
}
```

**Returns:** `HxMenuItem[]`

---

## Layout Store

`LayoutStore` is an **NgRx Signal Store** that manages all layout UI state. It is **not** provided globally — you must add it to the providers of your layout component.

### State shape

| Property | Type | Description |
|----------|------|-------------|
| `menuVisible` | `boolean` | Whether the menu is shown |
| `staticMenuDesktopInactive` | `boolean` | Legacy "hide the rail completely" flag. Still honoured by `HelixAppLayout`, but no longer reachable from the default UI |
| `sidebarCollapsed` | `boolean` | Desktop rail collapsed to icons; persisted in `localStorage` (`helix.nav-rail.collapsed`) |
| `overlayMenuActive` | `boolean` | Overlay menu open state |
| `profileSidebarVisible` | `boolean` | Profile sidebar open state |
| `configSidebarVisible` | `boolean` | Config sidebar open state |
| `staticMenuMobileActive` | `boolean` | Static menu expanded on mobile |
| `menuHoverActive` | `boolean` | Menu hover state (slim mode) |
| `darkTheme()` | `boolean` | Dark mode: the value of `HxTheme.dark()` (read-only here) |
| `primary()`, `surface()` | `HxPrimaryColor \| null`, `HxSurface \| null` | The chosen colours: the values of `HxTheme` |
| `menuMode` | `'static' \| 'overlay'` | Menu mode |

### Setup

```ts
import { LayoutStore } from '@gravionlabs/helix-shell';

@Component({
  standalone: true,
  providers: [LayoutStore], // scoped to this component tree
  ...
})
export class MyLayoutComponent {
  private layoutStore = inject(LayoutStore);

  toggleDark() {
    this.layoutStore.toggleDarkMode(); // switches HxTheme; the class on <html> follows
  }
}
```

---

## Auth Pages

### HelixLogin

**Selector:** `<helix-login>`  
**File:** `projects/shell/src/lib/pages/auth/login/login.ts`

Fully styled login page with email/password form. Emits credentials on submit; handles no server communication itself.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `logoUrl` | `string` | `''` | URL of the brand logo image. Empty string hides the logo |
| `logoAlt` | `string` | `'Logo'` | Alt text for the logo image |
| `headline` | `string` | `'Welcome back!'` | Main heading text |
| `subheadline` | `string` | `'Sign in to continue'` | Sub-heading below the headline |
| `emailPlaceholder` | `string` | `'Email address'` | Placeholder text for the email field |
| `passwordPlaceholder` | `string` | `'Password'` | Placeholder text for the password field |
| `submitLabel` | `string` | `'Sign In'` | Label for the submit button |
| `forgotPasswordLabel` | `string` | `'Forgot password?'` | Label for the forgot-password link |
| `forgotPasswordRoute` | `string` | `'/auth/forgot'` | Router path for the forgot-password link |
| `registerLabel` | `string` | `"Don't have an account?"` | Label for the register prompt |
| `registerRoute` | `string` | `'/auth/register'` | Router path for the registration link |

#### Outputs

| Name | Payload | Description |
|------|---------|-------------|
| `loginSubmit` | `HelixLoginCredentials` | Emitted when the user submits the login form |

#### Example

```html
<helix-login
  logoUrl="/assets/logo.svg"
  headline="Sign in to Gravion"
  (loginSubmit)="onLogin($event)"
/>
```

```ts
onLogin(credentials: HelixLoginCredentials) {
  this.authService.login(credentials.email, credentials.password).subscribe(...);
}
```

---

### HelixError

**Selector:** `<helix-error>`

Generic error page (e.g. 500 Internal Server Error).

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Error'` | Main error heading |
| `subtitle` | `string` | `'Something went wrong'` | Supporting message below the title |
| `homeLabel` | `string` | `'Go to Dashboard'` | Label for the home navigation button |
| `homeRoute` | `string` | `'/'` | Router path for the home navigation button |

#### Example

```html
<helix-error
  title="500 — Server Error"
  subtitle="Our team has been notified. Please try again later."
  homeRoute="/dashboard"
/>
```

---

### HelixAccess

**Selector:** `<helix-access>`

Access-denied / forbidden page (e.g. 403).

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Access Denied'` | Main heading |
| `subtitle` | `string` | `'You do not have permission to access this page'` | Supporting message |
| `homeLabel` | `string` | `'Go to Dashboard'` | Label for the home navigation button |
| `homeRoute` | `string` | `'/'` | Router path for the home navigation button |

---

### authRoutes

Pre-configured lazy route definitions for all auth pages. Import into your router config to automatically register `/auth/login`, `/auth/error`, and `/auth/access`.

```ts
import { authRoutes } from '@gravionlabs/helix-shell';

export const appRoutes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
  },
  { path: '**', redirectTo: 'auth/login' },
];
```

---

## Other Pages

### HelixEmpty

**Selector:** `<helix-empty>`  
**File:** `projects/shell/src/lib/pages/empty/empty.ts`

Blank page template with a title, optional subtitle, and a default content slot. Use as a starting point for new pages.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Empty Page'` | Page heading |
| `subtitle` | `string` | `''` | Optional supporting text below the heading |

#### Content Slots

| Slot | Selector | Description |
|------|----------|-------------|
| Default | *(none)* | Any projected content rendered inside the page body |

#### Example

```html
<helix-empty title="Reports" subtitle="No reports available yet.">
  <h-button label="Create Report" icon="pi pi-plus" />
</helix-empty>
```

---

### HelixNotfound

**Selector:** `<helix-notfound>`

404 Not Found page with configurable suggestions list.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'404 — Not Found'` | Main heading |
| `description` | `string` | `'The page you are looking for does not exist.'` | Description text |
| `homeLabel` | `string` | `'Go to Dashboard'` | Label for the home navigation button |
| `homeRoute` | `string` | `'/'` | Router path for the home navigation button |
| `suggestions` | `HelixNotfoundSuggestion[]` | Several default suggestions | List of quick-navigation suggestion links |

#### Example

```html
<helix-notfound
  homeRoute="/dashboard"
  [suggestions]="[
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Settings',  route: '/settings' },
  ]"
/>
```

---

## Landing Page Components

Use these components to build a public marketing / landing page. The recommended composition is:

```html
<helix-landing>
  <helix-topbar-widget />
  <helix-hero-widget (buttonClick)="scrollToFeatures()" />
  <helix-features-widget />
  <helix-highlights-widget />
  <helix-pricing-widget (planSelect)="onPlanSelect($event)" />
  <helix-footer-widget />
</helix-landing>
```

---

### HelixLanding

**Selector:** `<helix-landing>`

Page wrapper / container for all landing widgets. Provides consistent max-width, spacing, and scroll-anchor support. No public inputs.

---

### HelixTopbarWidget

**Selector:** `<helix-topbar-widget>`

Marketing topbar with navigation links and login/register buttons.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `navLinks` | `HelixNavLink[]` | 4 links (home, features, pricing, contact) | Fragment-based anchor links for single-page scrolling |
| `loginLabel` | `string` | `'Login'` | Label for the login button |
| `loginRoute` | `string` | `'/auth/login'` | Router path for the login button |
| `registerLabel` | `string` | `'Register'` | Label for the register button |
| `registerRoute` | `string` | `'/auth/login'` | Router path for the register button |

#### Example

```html
<helix-topbar-widget
  loginRoute="/auth/login"
  registerRoute="/auth/register"
  [navLinks]="[
    { label: 'Home',     fragment: 'hero' },
    { label: 'Features', fragment: 'features' },
    { label: 'Pricing',  fragment: 'pricing' },
  ]"
/>
```

---

### HelixHeroWidget

**Selector:** `<helix-hero-widget>`

Full-width hero section with a two-part headline, description, call-to-action button, and hero image.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `headlineLight` | `string` | *(library default)* | Light-weight (thin font) portion of the headline |
| `headline` | `string` | *(library default)* | Bold portion of the headline |
| `description` | `string` | *(library default)* | Paragraph text below the headline |
| `buttonLabel` | `string` | `'Get Started'` | Label for the CTA button |
| `imageUrl` | `string` | *(library default)* | URL of the hero image |
| `imageAlt` | `string` | `'Hero Image'` | Alt text for the hero image |

#### Outputs

| Name | Payload | Description |
|------|---------|-------------|
| `buttonClick` | `void` | Emitted when the CTA button is clicked |

#### Example

```html
<helix-hero-widget
  headlineLight="Build faster with"
  headline="Gravion UI"
  description="The Angular component library that gets you to production in days."
  buttonLabel="Start for free"
  imageUrl="/assets/hero.png"
  (buttonClick)="router.navigate(['/auth/register'])"
/>
```

---

### HelixFeaturesWidget

**Selector:** `<helix-features-widget>`

Feature highlight grid with optional customer testimonial card.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sectionTitle` | `string` | `'Marvelous Features'` | Section heading |
| `sectionSubtitle` | `string` | *(library default)* | Section sub-heading |
| `features` | `HelixFeature[]` | 9 default feature cards | Array of feature cards to display in the grid |
| `testimonial` | `HelixTestimonial \| null` | *(library default)* | Optional testimonial block. Pass `null` to hide |

#### Example

```html
<helix-features-widget
  sectionTitle="Why choose Gravion?"
  [features]="myFeatures"
  [testimonial]="myTestimonial"
/>
```

```ts
myFeatures: HelixFeature[] = [
  {
    icon: 'pi pi-bolt',
    iconBgClass: 'bg-yellow-200',
    iconColorClass: 'text-yellow-700',
    title: 'Blazing Fast',
    description: 'Optimized bundles and lazy loading out of the box.',
  },
];

myTestimonial: HelixTestimonial = {
  name: 'Jane Doe',
  company: 'Acme Corp',
  text: 'Gravion UI cut our delivery time in half.',
  logoUrl: '/assets/acme-logo.svg',
};
```

---

### HelixHighlightsWidget

**Selector:** `<helix-highlights-widget>`

Alternating image/text highlight blocks for showcasing key product capabilities.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sectionTitle` | `string` | `'Powerful Everywhere'` | Section heading |
| `sectionSubtitle` | `string` | *(library default)* | Section sub-heading |
| `highlights` | `HelixHighlight[]` | 2 default highlight blocks | Array of highlight items with image and text |

#### Example

```html
<helix-highlights-widget
  sectionTitle="Works on every device"
  [highlights]="myHighlights"
/>
```

```ts
myHighlights: HelixHighlight[] = [
  {
    icon: 'pi pi-desktop',
    iconBgClass: 'bg-blue-100',
    iconColorClass: 'text-blue-600',
    title: 'Desktop First',
    description: 'Optimised layouts for productivity on large screens.',
    imageUrl: '/assets/desktop-preview.png',
    imageAlt: 'Desktop screenshot',
    imageBgClass: 'bg-blue-50',
    imageAlign: 'right',
  },
];
```

---

### HelixPricingWidget

**Selector:** `<helix-pricing-widget>`

Pricing plan cards section with click-to-select interaction.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sectionTitle` | `string` | `'Matchless Pricing'` | Section heading |
| `sectionSubtitle` | `string` | *(library default)* | Section sub-heading |
| `plans` | `HelixPricingPlan[]` | 3 plans (Free / Startup / Enterprise) | Array of pricing plan cards |

#### Outputs

| Name | Payload | Description |
|------|---------|-------------|
| `planSelect` | `HelixPricingPlan` | Emitted when a card or its button is clicked |

#### Example

```html
<helix-pricing-widget
  [plans]="pricingPlans"
  (planSelect)="onPlanSelected($event)"
/>
```

```ts
pricingPlans: HelixPricingPlan[] = [
  {
    title: 'Free',
    price: '$0',
    pricePeriod: '/ month',
    imageUrl: '/assets/plan-free.svg',
    imageAlt: 'Free plan',
    buttonLabel: 'Get started',
    features: ['5 projects', '1 GB storage', 'Community support'],
  },
  {
    title: 'Pro',
    price: '$29',
    pricePeriod: '/ month',
    imageUrl: '/assets/plan-pro.svg',
    imageAlt: 'Pro plan',
    buttonLabel: 'Start free trial',
    features: ['Unlimited projects', '50 GB storage', 'Priority support'],
  },
];

onPlanSelected(plan: HelixPricingPlan) {
  this.router.navigate(['/checkout'], { queryParams: { plan: plan.title } });
}
```

---

### HelixFooterWidget

**Selector:** `<helix-footer-widget>`

Landing page footer with brand link and multi-column link groups. Uses the same [`HelixFooterColumn`](#helixfootercolumn) model as `HelixFooter`.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `brandName` | `string` | `'SAKAI'` | Brand name displayed in the footer |
| `homeRoute` | `string` | `'/'` | Router path the brand name links to |
| `columns` | `HelixFooterColumn[]` | *(library defaults)* | Link columns. Shares the `HelixFooterColumn` model with `HelixFooter` |

---

## UI Components

### HelixBadge

**Selector:** `<helix-badge>`  
**File:** `projects/shell/src/lib/ui/badge/badge.ts`

Small inline badge with color-coded severity and optional icon / label.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `severity` | `BadgeSeverity` | — | `'info'` \| `'warn'` \| `'error'` \| `'success'` |
| `label` | `string` | — | Text label inside the badge |
| `icon` | `string` | — | HelixIcons class (`pi pi-*`), e.g. `'pi pi-check'` |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size variant |

#### Example

```html
<helix-badge severity="success" icon="pi pi-check" label="Verified" />
<helix-badge severity="warn" label="Pending" size="sm" />
```

---

### HelixEnvironmentBadge

**Selector:** `<helix-environment-badge>`  
**File:** `projects/shell/src/lib/ui/badge/environment-badge.ts`

Convenience wrapper around `HelixBadge` that maps a named environment to a fixed severity, icon, and label.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `environment` | `Environment` | — | `'development'` \| `'testing'` \| `'staging'` \| `'production'` |

#### Mapped appearance

| Environment | Severity | Icon | Label |
|-------------|----------|------|-------|
| `development` | success | `pi pi-code` | Development |
| `testing` | info | `pi pi-flask` | Testing |
| `staging` | warn | `pi pi-layers` | Staging |
| `production` | error | `pi pi-verified` | Production |
| *unknown* | info | `pi pi-question` | Unknown |

#### Example

```html
<helix-environment-badge environment="staging" />
<helix-environment-badge [environment]="envName" />
```

### HelixPageHeader

**Selector:** `<helix-page-header>`  
**File:** `projects/shell/src/lib/ui/page-header/page-header.ts`

The header of a page: an optional breadcrumb, the title (an `h1` by default) with a subtitle, and the page's actions on the end edge. The actions are projected with the `helixPageActions` attribute and wrap under the title on narrow screens.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — (required) | The page title |
| `subtitle` | `string` | — | One line under the title |
| `breadcrumb` | `HxBreadcrumbItem[]` | — | The trail above the title (rendered with `hx-breadcrumb`); its last item is the current page |
| `home` | `HxBreadcrumbItem` | — | The first item of the breadcrumb, usually a home icon |
| `headingLevel` | `1–6` | `1` | The heading element of the title |

#### Example

```html
<helix-page-header title="Invoices" subtitle="Open and paid invoices" [breadcrumb]="crumbs" [home]="{ icon: 'pi pi-home', routerLink: '/' }">
  <button helixPageActions hx-button type="button" variant="outlined">Export</button>
  <button helixPageActions hx-button type="button">New invoice</button>
</helix-page-header>
```

### HelixStatCard

**Selector:** `<helix-stat-card>`  
**File:** `projects/shell/src/lib/ui/stat-card/stat-card.ts`

A dashboard figure on an `hx-card`: a label, the value, an icon in a tinted box, and a trend whose direction is shown by an arrow and colour and read out as "up", "down" or "flat" by screen readers. Extra content is projected below the trend.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — (required) | What the figure is; also the accessible name of the card |
| `value` | `string \| number` | — (required) | The figure; a number is formatted with `format` |
| `format` | `Intl.NumberFormatOptions` | — | e.g. `{ style: 'currency', currency: 'EUR' }` |
| `locale` | `string` | browser | Locale of the number formats |
| `icon` | `string` | — | Icon classes (`pi pi-users`) |
| `severity` | `'primary' \| 'info' \| 'success' \| 'warn' \| 'danger'` | `'primary'` | Colour of the icon box |
| `trend` | `number` | — | The change: positive is up (green), negative is down (red), 0 is flat |
| `trendUnit` | `string` | `'%'` | Appended to the trend figure |
| `trendLabel` | `string` | — | Text after the trend ("since last month") |
| `trendDigits` | `number` | `1` | Fraction digits of the trend |

#### Example

```html
<helix-stat-card label="Orders" [value]="152" icon="pi pi-shopping-cart" [trend]="24" trendUnit="" trendLabel="new since last visit" />
<helix-stat-card label="Revenue" [value]="2100" [format]="{ style: 'currency', currency: 'EUR' }" [trend]="-3.2" trendLabel="since last week" severity="warn" />
```

---

## Form Infrastructure

Structural components for building reactive forms with human-readable error messages. The
validators come from `@gravionlabs/helix-ui/validators` (see [Validators](HELIX-UI.md#validators)); the shell
itself does not depend on anything else for forms:

```ts
import { Validators } from '@gravionlabs/helix-ui/validators';
import { FormControl } from '@angular/forms';

const emailCtrl = new FormControl('', [
  Validators.required('Email is required'),
  Validators.email('Invalid email address'),
]);
```

`helix-form-field` shows the first error message of the control once it is touched and invalid.

---

### HelixFormField

**Selector:** `<helix-form-field>`  
**File:** `projects/shell/src/lib/form/form-field/form-field.ts`

A structural wrapper component that renders a label, projected input content, and hint/error messages. Uses `OnPush` change detection and is fully standalone.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text shown above the projected input |
| `control` | `AbstractControl \| null` | `null` | Reactive forms control for touched/invalid state detection |
| `hint` | `string` | — | Helper text shown below the field; hidden when an error is active |
| `error` | `string \| null` | `null` | External error message; overrides control-derived error |
| `showLabel` | `boolean` | `true` | Show or hide the label |
| `showHint` | `boolean` | `true` | Show or hide the hint/error area |

#### Computed `activeError`

Priority: `error()` input > control validation error (when touched + invalid) > `null`

#### Usage examples

```html
<!-- Text input with label, control, and hint -->
<helix-form-field label="Email" [control]="emailCtrl" hint="Work email preferred">
  <input hx-input fluid id="email" [formControl]="emailCtrl" />
</helix-form-field>

<!-- Helix number input -->
<helix-form-field label="Price" [control]="priceCtrl">
  <hx-input-number [formControl]="priceCtrl" mode="currency" currency="EUR" />
</helix-form-field>

<!-- External error (e.g. from server) -->
<helix-form-field label="Username" [control]="userCtrl" [error]="serverError()">
  <input hx-input fluid [formControl]="userCtrl" />
</helix-form-field>
```

---

## Interfaces

### HelixRouteMenuItem

The core menu/route model used by `HelixAppLayout`'s `[menu]` input, `HelixNavRail`, `helixRoutesFrom`, `helixMenuLinksFrom`, and routing utilities. Extends `HxMenuItem` of helix-ui with Angular routing properties.

```ts
interface HelixRouteMenuItem extends MenuItem {
  /** Angular route path segment (relative to parent route) */
  path?: string;
  /** Breadcrumb label or resolver function */
  breadcrumb?: string | ((route: ActivatedRouteSnapshot) => string);
  /** Component to render for this route */
  component?: Type<unknown>;
  /** Lazy-loaded children */
  loadChildren?: Route['loadChildren'];
  /** Route guards */
  canActivate?: CanActivateFn[];
  /** Additional route data (breadcrumb auto-injected) */
  data?: Record<string, unknown>;
  /** Nested child items (typed override of HxMenuItem.items) */
  items?: HelixRouteMenuItem[];
}
```

All `HxMenuItem` fields are inherited: `label`, `icon`, `routerLink`, `visible`, `disabled`, `badge`, `target`, `command`, `url`, etc.

---

### HelixTopbarAction

Used by [`HelixTopbar`](#helixtopbar) `topbarActions` input.

```ts
interface HelixTopbarAction {
  /** HelixIcons class (pi pi-*), e.g. 'pi pi-search' */
  icon: string;
  /** Accessible label for the button */
  label: string;
  /** Optional click handler */
  command?: () => void;
}
```

---

### HelixFooterLink

Used by [`HelixFooterColumn`](#helixfootercolumn).

```ts
interface HelixFooterLink {
  label: string;
  url: string;
}
```

---

### HelixFooterColumn

Used by [`HelixFooter`](#helixfooter) and [`HelixFooterWidget`](#helixfooterwidget).

```ts
interface HelixFooterColumn {
  title: string;
  links: HelixFooterLink[];
}
```

---

### HelixLoginCredentials

Emitted by [`HelixLogin`](#helixlogin) `loginSubmit` output.

```ts
interface HelixLoginCredentials {
  email: string;
  password: string;
}
```

---

### HelixNotfoundSuggestion

Used by [`HelixNotfound`](#helixnotfound) `suggestions` input.

```ts
interface HelixNotfoundSuggestion {
  label: string;
  route: string;
}
```

---

### HelixNavLink

Used by [`HelixTopbarWidget`](#helixtopbarwidget) `navLinks` input.

```ts
interface HelixNavLink {
  /** Display text */
  label: string;
  /** URL fragment (hash anchor) for single-page scrolling */
  fragment: string;
}
```

---

### HelixFeature

Used by [`HelixFeaturesWidget`](#helixfeatureswidget) `features` input.

```ts
interface HelixFeature {
  /** HelixIcons class (pi pi-*), e.g. 'pi pi-bolt' */
  icon: string;
  /** Tailwind background class for the icon container, e.g. 'bg-yellow-200' */
  iconBgClass: string;
  /** Tailwind text-color class for the icon, e.g. 'text-yellow-700' */
  iconColorClass: string;
  title: string;
  description: string;
  /** Optional inline CSS string — used for gradient border effects */
  cardStyle?: string;
}
```

---

### HelixTestimonial

Used by [`HelixFeaturesWidget`](#helixfeatureswidget) `testimonial` input.

```ts
interface HelixTestimonial {
  name: string;
  company: string;
  text: string;
  /** Optional company logo URL */
  logoUrl?: string;
}
```

---

### HelixHighlight

Used by [`HelixHighlightsWidget`](#helixhighlightswidget) `highlights` input.

```ts
interface HelixHighlight {
  /** HelixIcons class (pi pi-*) */
  icon: string;
  /** Tailwind background class for the icon container */
  iconBgClass: string;
  /** Tailwind text-color class for the icon */
  iconColorClass: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  /** Tailwind background class for the image container, e.g. 'bg-purple-100' */
  imageBgClass: string;
  /** Position of the image relative to the text block */
  imageAlign: 'left' | 'right';
}
```

---

### HelixPricingPlan

Used by [`HelixPricingWidget`](#helixpricingwidget) `plans` input and `planSelect` output.

```ts
interface HelixPricingPlan {
  title: string;
  /** Price string, e.g. '$29' */
  price: string;
  /** Period label, e.g. '/ month' */
  pricePeriod: string;
  imageUrl: string;
  imageAlt: string;
  buttonLabel: string;
  features: string[];
}
```
