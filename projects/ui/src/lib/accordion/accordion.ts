import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { nextId } from '../internal/ids';

export type HxAccordionValue = string | string[] | null;

/**
 * Stacked panels of which one (or with `multiple` several) is open, on `@angular/cdk/accordion`.
 *
 * ```html
 * <hx-accordion [(value)]="open" [headingLevel]="3">
 *   <hx-accordion-panel value="a">
 *     <hx-accordion-header>First</hx-accordion-header>
 *     <hx-accordion-content>Content of the first panel</hx-accordion-content>
 *   </hx-accordion-panel>
 *   <hx-accordion-panel value="b" disabled>…</hx-accordion-panel>
 * </hx-accordion>
 * ```
 *
 * `value` is the `value` of the open panel (`string | null`), or an array with `multiple`. The WAI-ARIA accordion
 * pattern: each header is a button inside a heading of `headingLevel`, with `aria-expanded` and `aria-controls`; the
 * content is a `region` labelled by its header. Arrow Down/Up, Home and End move between the headers.
 */
@Component({
  selector: 'hx-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: CdkAccordion, inputs: ['multi: multiple'] }],
  host: {
    class: 'hx-accordion',
    '(keydown)': 'onKeydown($event)',
  },
  template: '<ng-content />',
})
export class HxAccordion {
  /** The `value` of the open panel, or the values of the open panels with `multiple`. */
  readonly value = model<HxAccordionValue>(null);
  /** The level of the headings around the header buttons. */
  readonly headingLevel = input(3, { transform: numberAttribute });
  readonly #cdk = inject(CdkAccordion, { self: true });
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The values that are open, as a list. */
  readonly open = computed(() => {
    const value = this.value();
    return Array.isArray(value) ? value : value === null ? [] : [value];
  });

  /** Whether the panels open independently. */
  isMultiple(): boolean {
    return this.#cdk.multi;
  }

  /** Called by a panel when the user opened or closed it. */
  setOpen(panelValue: string, open: boolean): void {
    const current = untracked(() => this.open());
    if (this.#cdk.multi) {
      const has = current.includes(panelValue);
      if (open === has) return;
      this.value.set(open ? [...current, panelValue] : current.filter((v) => v !== panelValue));
    } else if (open) {
      if (current[0] !== panelValue) this.value.set(panelValue);
    } else if (current.includes(panelValue)) {
      this.value.set(null);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    const target = event.target as HTMLElement;
    if (!keys.includes(event.key) || !target.classList.contains('hx-accordion-trigger')) return;
    const headers = [
      ...this.#host.nativeElement.querySelectorAll<HTMLButtonElement>(
        '.hx-accordion-trigger:not(:disabled)',
      ),
    ];
    const at = headers.indexOf(target as HTMLButtonElement);
    if (at < 0) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? headers.length - 1
          : (at + (event.key === 'ArrowDown' ? 1 : -1) + headers.length) % headers.length;
    headers[next].focus();
  }
}

/** One panel of an accordion: a header and its content. */
@Component({
  selector: 'hx-accordion-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CdkAccordionItem],
  host: {
    class: 'hx-accordion-panel',
    '[class.hx-accordion-panel-open]': 'expanded()',
    '[class.hx-accordion-panel-disabled]': 'disabled()',
  },
  template: '<ng-content />',
})
export class HxAccordionPanel {
  /** Identifies the panel in the accordion's `value`. */
  readonly value = input.required<string>();
  /** The header cannot be toggled. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Whether the panel is open, as a signal for the header and the content. */
  readonly expanded = signal(false);
  protected readonly item = inject(CdkAccordionItem, { self: true });
  readonly accordion = inject(HxAccordion);
  readonly headerId = nextId('hx-accordion-header');
  readonly contentId = nextId('hx-accordion-content');

  constructor() {
    effect(() => {
      const disabled = this.disabled();
      untracked(() => {
        this.item.disabled = disabled;
      });
    });
    // the accordion's value drives the panel
    effect(() => {
      const open = this.accordion.open().includes(this.value());
      untracked(() => {
        if (this.item.expanded !== open) this.item.expanded = open;
      });
    });
    // and the user's toggles drive the accordion's value
    this.item.expandedChange.pipe(takeUntilDestroyed()).subscribe((expanded) => {
      this.expanded.set(expanded);
      this.accordion.setOpen(this.value(), expanded);
    });
  }

  toggle(): void {
    this.item.toggle();
  }
}

/** The header of a panel: a button inside a heading. */
@Component({
  selector: 'hx-accordion-header',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-accordion-header' },
  template: `
    <ng-template #button>
      <button
        type="button"
        class="hx-accordion-trigger"
        [id]="panel.headerId"
        [attr.aria-expanded]="panel.expanded()"
        [attr.aria-controls]="panel.contentId"
        [disabled]="panel.disabled()"
        (click)="panel.toggle()"
      >
        <span class="hx-accordion-title"><ng-content /></span>
        <span class="hx-accordion-icon" aria-hidden="true"></span>
      </button>
    </ng-template>
    @switch (level()) {
      @case (1) { <h1 class="hx-accordion-heading"><ng-container [ngTemplateOutlet]="button" /></h1> }
      @case (2) { <h2 class="hx-accordion-heading"><ng-container [ngTemplateOutlet]="button" /></h2> }
      @case (3) { <h3 class="hx-accordion-heading"><ng-container [ngTemplateOutlet]="button" /></h3> }
      @case (4) { <h4 class="hx-accordion-heading"><ng-container [ngTemplateOutlet]="button" /></h4> }
      @case (5) { <h5 class="hx-accordion-heading"><ng-container [ngTemplateOutlet]="button" /></h5> }
      @default { <h6 class="hx-accordion-heading"><ng-container [ngTemplateOutlet]="button" /></h6> }
    }
  `,
})
export class HxAccordionHeader {
  protected readonly panel = inject(HxAccordionPanel);
  protected readonly level = computed(() =>
    Math.min(6, Math.max(1, Math.round(this.panel.accordion.headingLevel()))),
  );
}

/** The content of a panel: a region labelled by its header; `inert` while the panel is closed. */
@Component({
  selector: 'hx-accordion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-accordion-content',
    '[attr.inert]': "panel.expanded() ? null : ''",
  },
  template: `
    <div class="hx-accordion-collapse">
      <div class="hx-accordion-collapse-inner">
        <div class="hx-accordion-body" role="region" [id]="panel.contentId" [attr.aria-labelledby]="panel.headerId">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class HxAccordionContent {
  protected readonly panel = inject(HxAccordionPanel);
}
