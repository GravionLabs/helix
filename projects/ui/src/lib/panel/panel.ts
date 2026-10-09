import { booleanAttribute, ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { nextId } from '../internal/ids';

/**
 * A titled container that can collapse. The `header` input is the title; `[hxPanelHeader]` adds content next to it
 * (icons, buttons) and `[hxPanelFooter]` is the footer.
 *
 * ```html
 * <hx-panel header="Filters" toggleable [(collapsed)]="closed">
 *   <button hxPanelHeader hx-button size="small">Reset</button>
 *   ...
 *   <div hxPanelFooter>3 filters active</div>
 * </hx-panel>
 * ```
 *
 * When `toggleable`, the header carries a `<button>` with `aria-expanded` and `aria-controls`; the content is a
 * region labelled by the title. Expanding and collapsing is animated unless the user prefers reduced motion.
 */
@Component({
  selector: 'hx-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-panel',
    '[class.hx-panel-toggleable]': 'toggleable()',
    '[class.hx-panel-collapsed]': 'isCollapsed()',
  },
  template: `
    <div class="hx-panel-header">
      <span class="hx-panel-title" [id]="titleId">{{ header() }}</span>
      <div class="hx-panel-header-actions"><ng-content select="[hxPanelHeader]" /></div>
      @if (toggleable()) {
        <button
          type="button"
          class="hx-panel-toggle"
          [attr.aria-expanded]="!isCollapsed()"
          [attr.aria-controls]="contentId"
          [attr.aria-labelledby]="titleId"
          (click)="toggle()"
        >
          <span class="hx-panel-toggle-icon" aria-hidden="true"></span>
        </button>
      }
    </div>
    <div class="hx-panel-collapse" [attr.inert]="isCollapsed() ? '' : null">
      <div class="hx-panel-collapse-inner">
        <div class="hx-panel-content" role="region" [id]="contentId" [attr.aria-labelledby]="titleId">
          <ng-content />
        </div>
        <div class="hx-panel-footer"><ng-content select="[hxPanelFooter]" /></div>
      </div>
    </div>
  `,
})
export class HxPanel {
  /** The title. */
  readonly header = input('');
  /** The header gets a button that collapses and expands the content. */
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Whether the content is collapsed (only a `toggleable` panel collapses). */
  readonly collapsed = model(false);

  protected readonly titleId = nextId('hx-panel-title');
  protected readonly contentId = nextId('hx-panel-content');
  protected isCollapsed(): boolean {
    return this.toggleable() && this.collapsed();
  }

  protected toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
