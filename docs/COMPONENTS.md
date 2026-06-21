# `@gravionlabs/helix` — Component API Reference

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
4. [Layout Store](#layout-store)
5. [Auth Pages](#auth-pages)
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
 9. [Form Infrastructure](#form-infrastructure)
    - [HelixValidators](#helixvalidators)
    - [helixFirstError](#helixfirsterror)
    - [HelixFormField](#helixformfield)
 10. [Interfaces](#interfaces)

---

## Installation

```bash
npm install @gravionlabs/helix
```

Peer dependencies: `@angular/core ^17`, `primeng ^17`, `@ngrx/signals`.

---

## Quick Start

```ts
// app.component.ts
import { Component } from '@angular/core';
import { HelixAppLayout, type HelixRouteMenuItem } from '@gravionlabs/helix';

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
**File:** `projects/helix/src/lib/layout/components/app-layout/app-layout.ts`

Top-level shell that composes the topbar, nav rail, footer, and router outlet into a full application layout. Forwards `appTitle` to `HelixTopbar`.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `appTitle` | `string` | `'Helix'` | Application title forwarded to `HelixTopbar` |
| `menu` | `HelixRouteMenuItem[]` | `[]` | Navigation menu model. Overrides route data when provided |
| `items` | `HelixTopbarItem[]` | `darkmode`, `configurator`, `mobile` | Topbar config items. Overrides the default items when provided |
| `topbarActions` | `HelixTopbarAction[]` | `calendar`, `inbox`, `profile` | Topbar dropdown action buttons. Provide `command` callbacks to handle clicks |
| `brandIcon` | `string` | — | Nav-rail brand icon: inline SVG (`<svg>…</svg>`) or URL to an SVG file. Falls back to the default helix icon |

#### Example

```html
<helix-app-layout
  appTitle="Gravion Portal"
  [menu]="myMenu"
  [items]="myItems"
  [topbarActions]="myActions"
  brandIcon="/assets/logo.svg"
/>
```

---

### HelixTopbar

**Selector:** `<helix-topbar>`  
**File:** `projects/helix/src/lib/layout/components/topbar/topbar.ts`

Application header bar. Renders a menu toggle, breadcrumb trail on the left, and configurable action buttons on the right.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `appTitle` | `string` | `'Helix'` | Application name |
| `topbarActions` | `HelixTopbarAction[]` | 3 icon buttons (calendar, inbox, profile) | Action buttons rendered in the right-side dropdown |
| `breadcrumbs` | `MenuItem[]` | Derived from route data | Breadcrumb trail. Falls back to route `data['breadcrumb']` resolution |
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
**File:** `projects/helix/src/lib/layout/components/status-bar/status-bar.ts`

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
**File:** `projects/helix/src/lib/layout/components/footer/footer.ts`

Application footer with optional multi-column link layout and a branded copyright line.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `brandName` | `string` | `'SAKAI'` | Brand name shown in the copyright line |
| `brandUrl` | `string` | `'https://primeng.org'` | URL the brand name links to |
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
**File:** `projects/helix/src/lib/layout/components/nav-rail/nav-rail.ts`

Branded side-navigation rail: gradient surface (theme-aware — "Harbor Tint" light
/ a neutral dark gradient that aliases the app's own dark-mode surface tokens
(`--surface-card`/`--surface-ground`), so the rail matches the panels and body
around it instead of an invented hue), a pill active state with a teal accent
bar, expandable submenus, and collapse-to-icons. Wired into `HelixAppLayout` in
place of the old
`HelixSidebar`/`HelixMenu`. Items reuse `HelixRouteMenuItem` (the same shape
consumed by `helixMenuLinksFrom`/`helixRoutesFrom`) — route-driven active state
and breadcrumbs keep working unchanged.

Items with children (e.g. "UI Components", "Pages") render as a normal clickable
item with a chevron rather than a static heading — clicking expands its children.
Only one item is expanded at a time app-wide (`LayoutStore.expandedRoot()`, the
same single-key accordion the old `HelixMenuItem` used).

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

Use `helixNavGroupsFromMenu(items: HelixRouteMenuItem[]): HelixNavGroup[]` to adapt
an existing flat `HelixRouteMenuItem[]` tree (as used by `HelixAppLayout`'s `menu`
input) into the shape `HelixNavRail` expects: it wraps the whole list as a single
unlabeled group, preserving each top-level item's own identity — an item with
`items` of its own still renders as an expandable parent, not a label. Construct
`HelixNavGroup[]` by hand instead (with `section` set) if you want real uppercase
section headers grouping multiple expandable items.

#### Example

```ts
import { helixNavGroupsFromMenu, type HelixRouteMenuItem } from '@gravionlabs/helix';

const menu: HelixRouteMenuItem[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
      { label: 'Analytics', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/analytics'] },
    ],
  },
];

const navGroups = helixNavGroupsFromMenu(menu);
```

```html
<helix-app-layout [menu]="menu" brandIcon="/assets/logo.svg" />
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

## Layout Store

**File:** `projects/helix/src/lib/layout/store/`

`LayoutStore` is an **NgRx Signal Store** that manages all layout UI state. It is **not** provided globally — you must add it to the providers of your layout component.

### State shape

| Property | Type | Description |
|----------|------|-------------|
| `menuVisible` | `boolean` | Whether the menu is shown |
| `staticMenuDesktopInactive` | `boolean` | Static menu collapsed on desktop |
| `overlayMenuActive` | `boolean` | Overlay menu open state |
| `profileSidebarVisible` | `boolean` | Profile sidebar open state |
| `configSidebarVisible` | `boolean` | Config sidebar open state |
| `staticMenuMobileActive` | `boolean` | Static menu expanded on mobile |
| `menuHoverActive` | `boolean` | Menu hover state (slim mode) |
| `theme` | `string` | Active PrimeNG theme name |
| `darkMode` | `boolean` | Dark mode toggle |

### Setup

```ts
import { LayoutStore } from '@gravionlabs/helix';

@Component({
  standalone: true,
  providers: [LayoutStore], // scoped to this component tree
  ...
})
export class MyLayoutComponent {
  private layoutStore = inject(LayoutStore);

  toggleDark() {
    this.layoutStore.setDarkMode(!this.layoutStore.darkMode());
  }
}
```

---

## Auth Pages

### HelixLogin

**Selector:** `<helix-login>`  
**File:** `projects/helix/src/lib/pages/auth/login/login.ts`

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
import { authRoutes } from '@gravionlabs/helix';

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
**File:** `projects/helix/src/lib/pages/empty/empty.ts`

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
  <p-button label="Create Report" icon="pi pi-plus" />
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

## Form Infrastructure

Validators, pipes, and structural components for building reactive forms with human-readable error messages.

### HelixValidators

**File:** `projects/helix/src/lib/form/validators/helix-validators.ts`

A namespace of `ValidatorFn` factories that produce human-readable error messages instead of the boolean flags used by Angular's built-in validators.

Every method accepts a static string or a `(value: any) => string` function for the error message, and most accept an `allowEmpty` parameter (default `true`).

#### Available validators

| Validator | Signature | Description |
|-----------|-----------|-------------|
| `required` | `(msg)` | Fails when value is `''`, `null`, or `undefined` |
| `email` | `(msg, allowEmpty?)` | Validates email format |
| `pattern` | `(msg, regex, allowEmpty?)` | Validates value matches the given regex |
| `date` | `(msg, allowEmpty?)` | Validates value is a parseable, non-NaN date |
| `number` | `(msg, allowEmpty?)` | Passes if value is coercible to a finite number (booleans excluded) |
| `integer` | `(msg, allowEmpty?)` | Passes if value is a whole number |
| `min` | `(msg, minimum, allowEmpty?)` | Passes if numeric value >= minimum |
| `max` | `(msg, maximum, allowEmpty?)` | Passes if numeric value <= maximum |
| `minLength` | `(msg, min, allowEmpty?)` | Passes if string/array length >= min |
| `maxLength` | `(msg, max, allowEmpty?)` | Passes if string/array length <= max |
| `oneOf` | `(msg, options)` | Passes if value is strictly contained in `options[]` |
| `allOf` | `(msg, options, allowEmpty?)` | Passes if value is an array where every element is in `options[]` |

#### Example

```ts
import { HelixValidators } from '@gravionlabs/helix';
import { FormControl } from '@angular/forms';

const emailCtrl = new FormControl('', [
  HelixValidators.required('Email is required'),
  HelixValidators.email('Invalid email address'),
  HelixValidators.maxLength((v) => `Max 100 characters (you entered ${v?.length})`, 100),
]);
```

The error object produced by these validators uses the validator name as the key and the message as the value:

```ts
emailCtrl.errors
// → { Email: 'Invalid email address' }
```

---

### helixFirstError

**Pipe name:** `helixFirstError`  
**File:** `projects/helix/src/lib/form/pipes/helix-first-error.pipe.ts`

A pure, standalone pipe that extracts the first human-readable error message from a `ValidationErrors | null` object. Designed to pair with `HelixValidators` (which produce string values), but also safe against Angular's built-in validators (non-string values are ignored).

#### Template usage

```html
@if (ctrl.touched && ctrl.invalid) {
  <small class="p-error">{{ ctrl.errors | helixFirstError }}</small>
}
```

#### Behaviour

| Input | Output |
|-------|--------|
| `null` | `''` |
| `undefined` | `''` |
| `{}` | `''` |
| `{ Required: 'Field is required' }` | `'Field is required'` |
| `{ Email: 'Bad email', MaxLength: 'Too long' }` | `'Bad email'` (first key) |
| `{ required: true }` | `''` (non-string value) |

---

### HelixFormField

**Selector:** `<helix-form-field>`  
**File:** `projects/helix/src/lib/form/form-field/form-field.ts`

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
  <input pInputText id="email" [formControl]="emailCtrl" class="w-full" />
</helix-form-field>

<!-- PrimeNG number input -->
<helix-form-field label="Price" [control]="priceCtrl">
  <p-inputnumber [formControl]="priceCtrl" mode="currency" currency="EUR" />
</helix-form-field>

<!-- External error (e.g. from server) -->
<helix-form-field label="Username" [control]="userCtrl" [error]="serverError()">
  <input pInputText [formControl]="userCtrl" class="w-full" />
</helix-form-field>
```

---

## Interfaces

### HelixTopbarAction

Used by [`HelixTopbar`](#helixtopbar) `topbarActions` input.

```ts
interface HelixTopbarAction {
  /** PrimeIcons class, e.g. 'pi pi-search' */
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
  /** PrimeIcon class, e.g. 'pi pi-bolt' */
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
  /** PrimeIcon class */
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
