# `@gravionlabs/helix` — Component API Reference

> All inputs use the Angular 17+ `input()` signal API and ship with defaults, so adding a new input is never a breaking change for consumers.

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Layout Components](#layout-components)
   - [GvAppLayout](#gvapplayout)
   - [GvTopbar](#gvtopbar)
   - [GvFooter](#gvfooter)
   - [GvMenu](#gvmenu)
   - [Internal Layout Components](#internal-layout-components)
4. [Layout Store](#layout-store)
5. [DI Tokens](#di-tokens)
6. [Auth Pages](#auth-pages)
   - [GvLogin](#gvlogin)
   - [GvError](#gverror)
   - [GvAccess](#gvaccess)
   - [authRoutes](#authroutes)
7. [Other Pages](#other-pages)
   - [GvEmpty](#gvempty)
   - [GvNotfound](#gvnotfound)
8. [Landing Page Components](#landing-page-components)
   - [GvLanding](#gvlanding)
   - [GvTopbarWidget](#gvtopbarwidget)
   - [GvHeroWidget](#gvherowidget)
   - [GvFeaturesWidget](#gvfeatureswidget)
   - [GvHighlightsWidget](#gvhighlightswidget)
   - [GvPricingWidget](#gvpricingwidget)
    - [GvFooterWidget](#gvfooterwidget)
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
import { GvAppLayout } from '@gravionlabs/helix';
import { GV_MENU_MODEL } from '@gravionlabs/helix';
import { MenuItem } from 'primeng/api';

const MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
  { label: 'Settings',  icon: 'pi pi-cog',  routerLink: '/settings' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GvAppLayout],
  providers: [
    { provide: GV_MENU_MODEL, useValue: MENU },
  ],
  template: `<gv-app-layout appTitle="My App" />`,
})
export class AppComponent {}
```

---

## Layout Components

### GvAppLayout

**Selector:** `<gv-app-layout>`  
**File:** `projects/helix/src/lib/layout/components/app-layout/app-layout.ts`

Top-level shell that composes the topbar, sidebar, footer, and router outlet into a full application layout. Forwards `appTitle` to `GvTopbar`.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `appTitle` | `string` | `'SAKAI'` | Application title forwarded to `GvTopbar` |

#### Example

```html
<gv-app-layout appTitle="Gravion Portal" />
```

---

### GvTopbar

**Selector:** `<gv-topbar>`  
**File:** `projects/helix/src/lib/layout/components/topbar/topbar.ts`

Application header bar. Renders the app title, configurable action buttons, and two named content slots.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `appTitle` | `string` | `'SAKAI'` | Application name displayed in the topbar |
| `topbarActions` | `GvTopbarAction[]` | 3 icon buttons (search, bell, user) | Action buttons rendered on the right side of the topbar |

#### Content Slots

| Slot | Selector | Description |
|------|----------|-------------|
| Start | `[gvTopbarStart]` | Content rendered to the left of the title (e.g. breadcrumbs) |
| End | `[gvTopbarEnd]` | Content rendered to the right of the action buttons (e.g. search bar) |

#### Example

```html
<gv-topbar appTitle="My App" [topbarActions]="myActions">
  <p-breadcrumb gvTopbarStart [model]="breadcrumbs" />
  <input gvTopbarEnd pInputText placeholder="Search…" />
</gv-topbar>
```

```ts
myActions: GvTopbarAction[] = [
  { icon: 'pi pi-bell', label: 'Notifications', command: () => this.openNotifications() },
  { icon: 'pi pi-user', label: 'Profile',        command: () => this.openProfile() },
];
```

---

### GvFooter

**Selector:** `<gv-footer>`  
**File:** `projects/helix/src/lib/layout/components/footer/footer.ts`

Application footer with optional multi-column link layout and a branded copyright line.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `brandName` | `string` | `'SAKAI'` | Brand name shown in the copyright line |
| `brandUrl` | `string` | `'https://primeng.org'` | URL the brand name links to |
| `columns` | `GvFooterColumn[]` | `[]` | Optional link columns rendered side-by-side. Uses the same [`GvFooterColumn`](#gvfootercolumn) model as `GvFooterWidget` |

#### Content Slots

| Slot | Selector | Description |
|------|----------|-------------|
| Start | `[gvFooterStart]` | Custom content rendered before the link columns |

#### Example

```html
<gv-footer
  brandName="Gravion"
  brandUrl="https://gravion.io"
  [columns]="footerColumns">
  <span gvFooterStart>© 2024 Gravion GmbH</span>
</gv-footer>
```

```ts
footerColumns: GvFooterColumn[] = [
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

### GvMenu

**Selector:** `<gv-menu>`  
**File:** `projects/helix/src/lib/layout/components/menu/menu.ts`

Sidebar navigation menu. Accepts a standard PrimeNG `MenuItem[]` tree.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[]` | `[]` | PrimeNG `MenuItem` array that defines the sidebar navigation structure |

#### Example

```ts
import { MenuItem } from 'primeng/api';

menuItems: MenuItem[] = [
  {
    label: 'Home',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home',  routerLink: ['/'] },
      { label: 'Analytics', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/analytics'] },
    ],
  },
];
```

```html
<gv-menu [model]="menuItems" />
```

---

### Internal Layout Components

The following components are exported for completeness but have **no public inputs**. They are orchestrated internally by `GvAppLayout`.

| Component | Selector | Purpose |
|-----------|----------|---------|
| `GvSidebar` | `<gv-sidebar>` | Sidebar shell that wraps `GvMenu` |
| `GvConfigurator` | `<gv-configurator>` | Theme/layout configuration panel |
| `GvFloatingConfigurator` | `<gv-floating-configurator>` | Floating toggle button for the configurator |
| `GvMenuItem` | `<gv-menuitem>` | Recursive menu item renderer |

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

## DI Tokens

### GV_MENU_MODEL

Injection token for providing the sidebar `MenuItem[]` model to the layout without prop-drilling.

```ts
import { GV_MENU_MODEL } from '@gravionlabs/helix';
import { MenuItem } from 'primeng/api';

// In your layout or app component providers:
providers: [
  {
    provide: GV_MENU_MODEL,
    useValue: myMenuItems satisfies MenuItem[],
  },
]
```

---

## Auth Pages

### GvLogin

**Selector:** `<gv-login>`  
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
| `loginSubmit` | `GvLoginCredentials` | Emitted when the user submits the login form |

#### Example

```html
<gv-login
  logoUrl="/assets/logo.svg"
  headline="Sign in to Gravion"
  (loginSubmit)="onLogin($event)"
/>
```

```ts
onLogin(credentials: GvLoginCredentials) {
  this.authService.login(credentials.email, credentials.password).subscribe(...);
}
```

---

### GvError

**Selector:** `<gv-error>`

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
<gv-error
  title="500 — Server Error"
  subtitle="Our team has been notified. Please try again later."
  homeRoute="/dashboard"
/>
```

---

### GvAccess

**Selector:** `<gv-access>`

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

### GvEmpty

**Selector:** `<gv-empty>`  
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
<gv-empty title="Reports" subtitle="No reports available yet.">
  <p-button label="Create Report" icon="pi pi-plus" />
</gv-empty>
```

---

### GvNotfound

**Selector:** `<gv-notfound>`

404 Not Found page with configurable suggestions list.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'404 — Not Found'` | Main heading |
| `description` | `string` | `'The page you are looking for does not exist.'` | Description text |
| `homeLabel` | `string` | `'Go to Dashboard'` | Label for the home navigation button |
| `homeRoute` | `string` | `'/'` | Router path for the home navigation button |
| `suggestions` | `GvNotfoundSuggestion[]` | Several default suggestions | List of quick-navigation suggestion links |

#### Example

```html
<gv-notfound
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
<gv-landing>
  <gv-topbar-widget />
  <gv-hero-widget (buttonClick)="scrollToFeatures()" />
  <gv-features-widget />
  <gv-highlights-widget />
  <gv-pricing-widget (planSelect)="onPlanSelect($event)" />
  <gv-footer-widget />
</gv-landing>
```

---

### GvLanding

**Selector:** `<gv-landing>`

Page wrapper / container for all landing widgets. Provides consistent max-width, spacing, and scroll-anchor support. No public inputs.

---

### GvTopbarWidget

**Selector:** `<gv-topbar-widget>`

Marketing topbar with navigation links and login/register buttons.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `navLinks` | `GvNavLink[]` | 4 links (home, features, pricing, contact) | Fragment-based anchor links for single-page scrolling |
| `loginLabel` | `string` | `'Login'` | Label for the login button |
| `loginRoute` | `string` | `'/auth/login'` | Router path for the login button |
| `registerLabel` | `string` | `'Register'` | Label for the register button |
| `registerRoute` | `string` | `'/auth/login'` | Router path for the register button |

#### Example

```html
<gv-topbar-widget
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

### GvHeroWidget

**Selector:** `<gv-hero-widget>`

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
<gv-hero-widget
  headlineLight="Build faster with"
  headline="Gravion UI"
  description="The Angular component library that gets you to production in days."
  buttonLabel="Start for free"
  imageUrl="/assets/hero.png"
  (buttonClick)="router.navigate(['/auth/register'])"
/>
```

---

### GvFeaturesWidget

**Selector:** `<gv-features-widget>`

Feature highlight grid with optional customer testimonial card.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sectionTitle` | `string` | `'Marvelous Features'` | Section heading |
| `sectionSubtitle` | `string` | *(library default)* | Section sub-heading |
| `features` | `GvFeature[]` | 9 default feature cards | Array of feature cards to display in the grid |
| `testimonial` | `GvTestimonial \| null` | *(library default)* | Optional testimonial block. Pass `null` to hide |

#### Example

```html
<gv-features-widget
  sectionTitle="Why choose Gravion?"
  [features]="myFeatures"
  [testimonial]="myTestimonial"
/>
```

```ts
myFeatures: GvFeature[] = [
  {
    icon: 'pi pi-bolt',
    iconBgClass: 'bg-yellow-200',
    iconColorClass: 'text-yellow-700',
    title: 'Blazing Fast',
    description: 'Optimized bundles and lazy loading out of the box.',
  },
];

myTestimonial: GvTestimonial = {
  name: 'Jane Doe',
  company: 'Acme Corp',
  text: 'Gravion UI cut our delivery time in half.',
  logoUrl: '/assets/acme-logo.svg',
};
```

---

### GvHighlightsWidget

**Selector:** `<gv-highlights-widget>`

Alternating image/text highlight blocks for showcasing key product capabilities.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sectionTitle` | `string` | `'Powerful Everywhere'` | Section heading |
| `sectionSubtitle` | `string` | *(library default)* | Section sub-heading |
| `highlights` | `GvHighlight[]` | 2 default highlight blocks | Array of highlight items with image and text |

#### Example

```html
<gv-highlights-widget
  sectionTitle="Works on every device"
  [highlights]="myHighlights"
/>
```

```ts
myHighlights: GvHighlight[] = [
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

### GvPricingWidget

**Selector:** `<gv-pricing-widget>`

Pricing plan cards section with click-to-select interaction.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sectionTitle` | `string` | `'Matchless Pricing'` | Section heading |
| `sectionSubtitle` | `string` | *(library default)* | Section sub-heading |
| `plans` | `GvPricingPlan[]` | 3 plans (Free / Startup / Enterprise) | Array of pricing plan cards |

#### Outputs

| Name | Payload | Description |
|------|---------|-------------|
| `planSelect` | `GvPricingPlan` | Emitted when a card or its button is clicked |

#### Example

```html
<gv-pricing-widget
  [plans]="pricingPlans"
  (planSelect)="onPlanSelected($event)"
/>
```

```ts
pricingPlans: GvPricingPlan[] = [
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

onPlanSelected(plan: GvPricingPlan) {
  this.router.navigate(['/checkout'], { queryParams: { plan: plan.title } });
}
```

---

### GvFooterWidget

**Selector:** `<gv-footer-widget>`

Landing page footer with brand link and multi-column link groups. Uses the same [`GvFooterColumn`](#gvfootercolumn) model as `GvFooter`.

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `brandName` | `string` | `'SAKAI'` | Brand name displayed in the footer |
| `homeRoute` | `string` | `'/'` | Router path the brand name links to |
| `columns` | `GvFooterColumn[]` | *(library defaults)* | Link columns. Shares the `GvFooterColumn` model with `GvFooter` |

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

### GvTopbarAction

Used by [`GvTopbar`](#gvtopbar) `topbarActions` input.

```ts
interface GvTopbarAction {
  /** PrimeIcons class, e.g. 'pi pi-search' */
  icon: string;
  /** Accessible label for the button */
  label: string;
  /** Optional click handler */
  command?: () => void;
}
```

---

### GvFooterLink

Used by [`GvFooterColumn`](#gvfootercolumn).

```ts
interface GvFooterLink {
  label: string;
  url: string;
}
```

---

### GvFooterColumn

Used by [`GvFooter`](#gvfooter) and [`GvFooterWidget`](#gvfooterwidget).

```ts
interface GvFooterColumn {
  title: string;
  links: GvFooterLink[];
}
```

---

### GvLoginCredentials

Emitted by [`GvLogin`](#gvlogin) `loginSubmit` output.

```ts
interface GvLoginCredentials {
  email: string;
  password: string;
}
```

---

### GvNotfoundSuggestion

Used by [`GvNotfound`](#gvnotfound) `suggestions` input.

```ts
interface GvNotfoundSuggestion {
  label: string;
  route: string;
}
```

---

### GvNavLink

Used by [`GvTopbarWidget`](#gvtopbarwidget) `navLinks` input.

```ts
interface GvNavLink {
  /** Display text */
  label: string;
  /** URL fragment (hash anchor) for single-page scrolling */
  fragment: string;
}
```

---

### GvFeature

Used by [`GvFeaturesWidget`](#gvfeatureswidget) `features` input.

```ts
interface GvFeature {
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

### GvTestimonial

Used by [`GvFeaturesWidget`](#gvfeatureswidget) `testimonial` input.

```ts
interface GvTestimonial {
  name: string;
  company: string;
  text: string;
  /** Optional company logo URL */
  logoUrl?: string;
}
```

---

### GvHighlight

Used by [`GvHighlightsWidget`](#gvhighlightswidget) `highlights` input.

```ts
interface GvHighlight {
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

### GvPricingPlan

Used by [`GvPricingWidget`](#gvpricingwidget) `plans` input and `planSelect` output.

```ts
interface GvPricingPlan {
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
