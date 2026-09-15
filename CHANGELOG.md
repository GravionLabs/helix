# Changelog

All notable changes to this project are documented here. Generated with
[git-cliff](https://github.com/orhun/git-cliff) from [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added

- Vendor PrimeNG 21.1.9 as @gravionlabs/helix with h- selectors
- Vendor @primeuix/utils into helix-core (uix/utils) (#433)
- Vendor @primeuix/motion into helix-core (uix/motion) (#434)
- Vendor @primeuix/styled into helix-core (uix/styled) (#435)
- Vendor @primeuix/styles component CSS into helix-core (#436)
- Vendor @primeuix/themes engine + aura/lara/nora presets (#437)
- Migrate off @primeuix/themes, remove all @primeuix/* deps (#438)
- **[breaking]** Rename .p-*/--p-*/data-p-* to .h-*/--h-*/data-h-* (#439)

### Changed

- Migrate helix-shell and helix-demo from primeng to @gravionlabs/helix
- Migrate to signals — slider–terminal (batch 8) (#319) (#349)
- Migrate to signals — textarea–treetable (batch 9) (#320) (#350)
- Migrate to signals — directives & infrastructure (batch 10) (#321) (#351)
- Migrate to signals — table & treetable (batch 11) (#322) (#352)
- Migrate to signals — large components (batch 12) (#323) (#354)
- Migrate remaining small-component decorators to signals (#360) (#388)
- Migrate remaining directive decorator leftovers to signals (#361) (#389)
- Migrate scroller and overlay decorator leftovers to signals (#362) (#390)
- Migrate table decorator leftovers to signals (#363) (#391)
- Migrate treeselect decorator leftovers to signals (#392)
- Migrate treetable decorator leftovers to signals (#393)
- Migrate multiselect decorator leftovers to signals (#394)
- Migrate datepicker decorator leftovers to signals (#395)
- Migrate picklist decorator leftovers to signals (#371) (#399)
- Migrate select decorator leftovers to signals (#366) (#396)
- Migrate tree decorator leftovers to signals (#369) (#397)
- Migrate autocomplete decorator leftovers to signals (#370) (#398)
- Migrate galleria decorator leftovers to signals (#372) (#400)
- Rename PrimeIcons class to HelixIcons (#402)
- Rename PrimeTemplate to HelixTemplate (#403)
- Rename PrimeNG config class and providePrimeNG to HelixConfig/provideHelix (#404)
- Move validators from helix-shell to helix and drop the Helix prefix (#405)
- Move form utils and first-error pipe from helix-shell to helix (#406)
- Migrate remaining directive decorator leftovers to signals (#361) (#408)
- Migrate scroller and overlay decorator leftovers to signals (#362) (#409)
- Port signals migration work to release (#410)
- Rename packages to @helix/core, @helix/shell, @helix/zod, @helix/ag-grid (#384) (#415)
- Rename packages to @gravionlabs/helix-core, helix-shell, helix-zod, helix-ag-grid (#419)

### Documentation

- Close out signal migration epic — update audit doc (#324) (#355)
- Close out signal migration epic — update audit doc (#324) (#407)
- Documentation refresh (generator, manual docs, GH Pages demo) (#416)

### Fixed

- Repair signal-migration spec breakage (batch 1/3: fileupload, scroller, toggleswitch, inputmask, treetable, carousel, selectbutton, slider, toast) (#411)
- Repair signal-migration spec breakage (batch 2/3: password, skeleton, listbox, panel, speeddial, paginator, select, scrolltop, cascadeselect, splitter, metergroup, menubar, inputnumber, orderlist, editor, scrollpanel, dataview) (#412)
- Repair signal-migration spec breakage (batch 3/3: menus, dialogs, small components) (#413)

### Other

- 22.0.0 — Angular 22 upgrade & signals-first modernization (#233) (#291)
## [1.2.9] - 2026-07-13

### Added

- Add advanced/JSON dynamic form demos with source-tabs viewer

### Fixed

- Match nav rail active path on segment boundaries
## [1.2.8] - 2026-07-12

### Changed

- Rename library project projects/helix to projects/helix-shell (#207) (#222)
- Migrate all consumers to @gravionlabs/helix-shell (#223)
## [1.2.6] - 2026-07-01

### Added

- Restructure CI workflow to include version determination, build, test, and publish steps
- Update package-manager-version to 11.6.0 in publish steps
- Update package-manager-version to 11.9.0 in CI workflow
## [1.2.5] - 2026-06-27

### Added

- Add HelixSelect - reliable native select wrapper for OnPush forms (#173)
## [1.2.4] - 2026-06-24

### Added

- Create @gravionlabs/helix-ag-grid library (#170) (#171)
## [1.2.3] - 2026-06-24

### Added

- Add @gravionlabs/helix-zod Zod v4 → HelixValidatorKe… (#169)
## [1.2.2] - 2026-06-22

### Added

- Use dist/helix/styles.css instead of local tailwind.css (#168)
## [1.2.0] - 2026-06-21

### Added

- Items/topbarActions/brandIcon inputs for HelixAppLayout + HelixNavRail (#166) +semver: minor

### Fixed

- Remove alertCount from demo app-shell
- Access protected isInlineSvg via cast in nav-rail spec
## [1.1.1] - 2026-06-21

### Fixed

- Ship prebuilt Tailwind CSS for library components (#165)
## [1.1.0] - 2026-06-21

### Added

- Add HelixValidatorKey enum and validator internals (#21)
- Add HelixValidators with required, email, pattern, date (#22)
- Add HelixValidators with required, email, pattern, date (#22)
- Add HelixValidators number, integer, min, max (#23)
- Add HelixValidators number, integer, min, max (#23)
- Add HelixValidators minLength, maxLength, oneOf, allOf (#24)
- Add HelixValidators minLength, maxLength, oneOf, allOf (#24)
- Add HelixFirstErrorPipe — implementation + tests (#26)
- Add HelixFirstErrorPipe — implementation + tests (#26)
- Add helixFormErrorMap utility (#27)
- Add helixFormErrorMap utility (#27)
- Add HelixFormArrayWithFactory (#28)
- Add HelixFormArrayWithFactory (#28)
- Add HelixFormField component class with computed signals (#29)
- Add HelixFormField component class with computed signals (#29)
- Create HelixBreadcrumb type + HELIX_BREADCRUMB injection token (#40) (#70)
- Add data.breadcrumb support to HelixRouteMenuItem (#46) (#71)
- Create helixBreadcrumbsFromRoutes utility (#44) (#72)
- Integrate p-breadcrumb into HelixTopbar (#45) (#73)
- Create HelixBadge base component (#41) (#74)
- Create HelixEnvironmentBadge component (#42) (#75)
- Create HelixAlertBadge component (#49) (#76)
- Integrate HelixEnvironmentBadge and HelixAlertBadge into HelixTopbar (#50) (#77)
- Add sidebarCollapsed state to LayoutStore (#51) (#78)
- Add brand header to HelixSidebar (#52) (#79)
- Update HelixMenuItem for collapsed mode (#53) (#80)
- Add collapse toggle button to HelixSidebar (#54) (#81)
- Add collapsed sidebar SCSS styles (#55) (#82)
- Update HelixAppLayout container classes for collapsed mode (#56) (#83)
- Integrate new controls into demo app
- Badge consolidation, sidebar accordion, menu item fixes
- Uniform 0.5rem spacing, cursor fixes, form field gap alignment
- Remove HELIX_MENU_MODEL fallback from HelixSidebar, move to HelixAppLayout (#129)
- Remove HELIX_MENU_MODEL fallback from HelixSidebar, move to HelixAppLayout (#129)
- Remove HELIX_MENU_MODEL fallback, prioritize route data for menu resolution
- Implement initial dashboard with widgets

### Changed

- Remove sidebar logo/brand section

### Documentation

- Add Forms section to COMPONENTS.md (#20) (#68)

### Fixed

- Correct double-replace typo in ROADMAP.md
- Rename gv-form-field selector to helix-form-field
- Rename gv-form-field selector to helix-form-field
- Standardize spacing and fix Dashboard navigation (#84)
- Remove biome from HTML lint-staged command — biome ignores *.html, returns non-zero exit
- Remove biome from HTML lint-staged command
- Remove biome from HTML lint-staged command — biome ignores *.html and returns non-zero exit
- Remove biome from HTML lint-staged command — biome ignores *.html, returns non-zero exit
## [1.0.0] - 2026-06-14

### Added

- Add GvFloatingConfigurator to library (closes #1)
- Migrate auth pages and notfound into library (#2)
- Migrate GvEmpty into library (#3)
- Migrate landing page and widgets to sakai-ui library (closes #4)
- Parameterize library pages with signal inputs/outputs
- Parameterize GvFooter, GvTopbar, GvMenu, GvAppLayout (closes #6)
- Parameterize GvTopbarWidget, GvFooterWidget, GvHeroWidget (closes #7)
- Parameterize complex landing widgets (closes #8)
- Unified route-menu model — GvRouteMenuItem + gvRoutesFrom (#10)
- Eliminate sub-menu duplication with metadata files + gvMenuLinksFrom
- Use sakai-ui source path; switch CI to angular-ci workflow

### Changed

- Move layout styles into component-level SCSS
- Use GravionLabs/ci/angular-package.yml reusable workflow
- Use GravionLabs/ci/angular-package.yml reusable workflow

### Documentation

- Add ROADMAP.md for Phase 3 planning
- Add Copilot instructions, translate ROADMAP to English
- Add COMPONENTS.md API reference (closes #9)
- Update README for project rename to helix

### Fixed

- Add missing layout SCSS styles
- Fix menu styles using :host() to cross ViewEncapsulation boundary
- Fix menu indentation and overflow scoping
- Ensure sakai-ui is built before demo; add dev watch script
- Add permissions block to ci.yml for reusable workflow
- Raise contents from read to write for release job

