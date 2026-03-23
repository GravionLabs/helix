/*
 * Public API Surface of @gravion/sakai-ui
 */

// Store
export * from './lib/layout/store';

// Tokens
export { GV_MENU_MODEL } from './lib/layout/menu-model.token';

// Route-menu model
export { gvMenuLinksFrom, gvRoutesFrom } from './lib/layout/route-menu.model';
export type { GvRouteMenuItem } from './lib/layout/route-menu.model';

// Pages
export { GvAccess } from './lib/pages/auth/access/access';
export { authRoutes } from './lib/pages/auth/auth.routes';
export { GvError } from './lib/pages/auth/error/error';
export { GvLogin } from './lib/pages/auth/login/login';
export type { GvLoginCredentials } from './lib/pages/auth/login/login';
export { GvEmpty } from './lib/pages/empty/empty';
export { GvFeaturesWidget } from './lib/pages/landing/components/features-widget/features-widget';
export { GvFooterWidget } from './lib/pages/landing/components/footer-widget/footer-widget';
export { GvHeroWidget } from './lib/pages/landing/components/hero-widget/hero-widget';
export { GvHighlightsWidget } from './lib/pages/landing/components/highlights-widget/highlights-widget';
export { GvPricingWidget } from './lib/pages/landing/components/pricing-widget/pricing-widget';
export { GvTopbarWidget } from './lib/pages/landing/components/topbar-widget/topbar-widget';
export { GvLanding } from './lib/pages/landing/landing';
export type {
  GvFeature,
  GvHighlight,
  GvNavLink,
  GvPricingPlan,
  GvTestimonial,
} from './lib/pages/landing/landing.model';
export { GvNotfound } from './lib/pages/notfound/notfound';
export type { GvNotfoundSuggestion } from './lib/pages/notfound/notfound';

// Components
export { GvAppLayout } from './lib/layout/components/app-layout/app-layout';
export { GvConfigurator } from './lib/layout/components/configurator/configurator';
export { GvFloatingConfigurator } from './lib/layout/components/floating-configurator/floating-configurator';
export { GvFooter } from './lib/layout/components/footer/footer';
export type { GvFooterColumn, GvFooterLink } from './lib/layout/components/footer/footer.model';
export { GvMenuItem } from './lib/layout/components/menu-item/menu-item';
export { GvMenu } from './lib/layout/components/menu/menu';
export { GvSidebar } from './lib/layout/components/sidebar/sidebar';
export { GvTopbar } from './lib/layout/components/topbar/topbar';
export type { GvTopbarAction } from './lib/layout/components/topbar/topbar';
