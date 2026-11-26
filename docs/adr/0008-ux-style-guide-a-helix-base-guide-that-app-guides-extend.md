# ADR 0008: UX style guide: a Helix base guide that app guides extend

- Status: Proposed
- Date: 2026-11-26
- Issues: #1208, #1205, #1206, #1204 (objective)
- Builds on: [ADR 0002](0002-retire-helix-core.md), [ADR 0004](0004-surface-roles-dark-elevation-density-and-named-theme-presets.md)

## Context

Four Tauri apps build on Helix: nixe, poimen, gantry (helix-desktop) and agentlens (helix-shell). They share the
components and tokens, yet their forms and dialogs look and behave differently, because nothing written says how a
screen is put together:

- `docs/UX-RULES.md` (#1115) covers feedback, which element for what, confirm or undo, tooltips, empty and error
  states and motion. It says nothing about forms, dialog layout, button hierarchy, typography or spacing, and no app
  links it from its `AGENTS.md`.
- The `ui-styleguide` skill of GravionLabs/skills creates a project `docs/STYLEGUIDE.md` (core file plus deep dives)
  from templates, but each project gets a full copy. No app has one yet.
- The inventory of 2026-11-26 shows what fills the gap. Nixe has 167 of 181 buttons and all 44 inputs as
  hand-styled native elements, 16 stylesheets with their own control look and 9 px font sizes. Poimen has all 28
  selects raw. The _Clone vault_ dialog in nixe has an unlabelled field, two buttons of equal weight and a disabled
  primary action without a reason.
- Helix has no type scale tokens, no form field and no list row, so apps hand-build exactly these (#1206).
- An agent writes most of the UI code. It follows what it is pointed at: a guide in the repository, linked from
  `AGENTS.md`, and a check that fails.

The Orca style guide (`stablyai/orca`, `docs/styleguide/`) shows a working shape: a short core file, deep dives
per topic, roles instead of values, a review rubric with a fixed output, and rules enforced by lint.

## Decision

1. **Helix owns the base guide.** A UX style guide for apps lives in `docs/` of this repository. `UX-RULES.md`
   becomes part of it. It is the only base: apps do not copy it.
2. **Shape.** A core file of at most 100 lines and deep dives an agent reads only when a task touches the topic:
   `forms`, `dialogs`, `components` (button hierarchy, which primitive for which job), `color` (the `--h-*` roles of
   ADR 0004), `ux-rules` (today's `UX-RULES.md`) and `ux-review-rubric`. The shape is the one of the `ui-styleguide`
   templates, so the skill and the guide stay interchangeable.
3. **Content rules.** The guide names roles, never values; the tokens hold the values. Every rule is measurable and
   names the Helix component, directive or token that carries it. A rule without a carrier is a gap in Helix and an
   issue, not a rule an app implements by hand.
4. **Versioned with the packages.** The guide is published in `@gravionlabs/helix-ui`, so an app reads the guide of
   the version it installs, and on the docs site. A new or stricter rule is a changelog entry of the release that
   brings it.
5. **App guides extend it.** Each app has a `docs/STYLEGUIDE.md` that names the base guide (path in
   `node_modules`), lists only the app's own rules and deviations, each with a reason, and is linked from
   `AGENTS.md`. An app may tighten a base rule; it relaxes one only as a named deviation. The `ui-styleguide` skill
   creates and syncs app guides in this form.
6. **Enforcement.** Helix publishes a lint preset: Stylelint (no hex, no raw color functions, font sizes from the
   scale) and a template check (no raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<progress>` without a Helix
   directive), each with an allowlist whose entries name a reason. The preset blocks in CI. The review rubric
   produces notes; a rubric finding blocks only when an acceptance criterion names it, as the `code-review` skill
   already does.
7. **Language.** English, like the rest of `docs/`.

## Consequences

- One place to change a rule; the apps pick it up with a Helix release and the `ui-styleguide` sync.
- Gaps become visible: rule 3 turns every hand-built pattern into a Helix issue (type scale, form field, list row
  in #1206).
- Helix gains a documentation surface it must keep current: a component change that breaks a rule changes the guide
  in the same PR.
- The package grows by the guide files.
- Apps carry a migration: GravionLabs/nixe#665, GravionLabs/poimen#1354, GravionLabs/gantry#145,
  GravionLabs/agentlens#550. A stricter rule or a new lint rule needs an allowlist phase in the apps, so a Helix
  release does not turn their CI red at once.
- The guide depends on ADR 0004 (surface roles, density); it is written against that ADR's roles and has to follow
  it if the ADR changes before acceptance.
- `ui-styleguide` needs an `extends` mode (GravionLabs/skills#1025) before app guides can follow decision 5.

## Alternatives

- **A guide per app, no base.** Rejected: the apps already drift apart without any guide, and four copies of the
  same rules drift faster.
- **The base guide in GravionLabs/skills.** Rejected: the skill is the tool, not the owner of the design system;
  the guide would not be versioned with the components it describes.
- **A separate design documentation repository.** Rejected: a third source next to the components and the apps,
  released on its own schedule.
- **Rules only as lint, no written guide.** Rejected: lint catches raw controls and values, not layout, hierarchy,
  focus or texts; agents and reviewers need the written rules for those.
- **Adopt the Orca guide as is.** Rejected: it is written for React, shadcn, Tailwind and lucide; its rules are
  taken over, its class names and components are not.
