import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  untracked,
} from '@angular/core';
import { nextId } from '../internal/ids';

/** Identifies a step and its panel. */
export type HxStepValue = string | number;

/** What the template of a lazy step panel receives. */
export interface HxStepContentContext {
  /** Makes the step with this value the active one, e.g. `(click)="activateCallback(2)"`. */
  activateCallback: (value: HxStepValue) => void;
  /** The value of the panel. */
  value: HxStepValue;
}

/**
 * The steps of a process, one panel at a time.
 *
 * ```html
 * <hx-stepper [(value)]="step" linear>
 *   <hx-step-list>
 *     <hx-step [value]="1">Account</hx-step>
 *     <hx-step [value]="2">Address</hx-step>
 *   </hx-step-list>
 *   <hx-step-panels>
 *     <hx-step-panel [value]="1">
 *       <ng-template hxStepContent let-activateCallback="activateCallback">
 *         <button hx-button (click)="activateCallback(2)">Next</button>
 *       </ng-template>
 *     </hx-step-panel>
 *     <hx-step-panel [value]="2">…</hx-step-panel>
 *   </hx-step-panels>
 * </hx-stepper>
 * ```
 *
 * `value` is the `value` of the active step (the first enabled step while it is `null`). The steps before it count
 * as completed. With `linear` the steps after the active one are disabled: the way forward is `activateCallback` (or
 * `next()`), which the app calls once the step is valid; going back is always possible. A panel with an
 * `<ng-template hxStepContent>` is lazy: created when its step becomes active and, without `keepAlive`, destroyed when
 * the step is left. Plain panel content is created up front and only hidden.
 */
@Component({
  selector: 'hx-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-stepper' },
  template: '<ng-content />',
})
export class HxStepper {
  /** The `value` of the active step. */
  readonly value = model<HxStepValue | null>(null);
  /** Steps after the active one cannot be chosen from their header. */
  readonly linear = input(false, { transform: booleanAttribute });
  /** Keep the content of lazy panels after their step is left. */
  readonly keepAlive = input(false, { transform: booleanAttribute });

  readonly id = nextId('hx-stepper');
  /** The steps in the order they were declared. */
  readonly steps = signal<readonly HxStep[]>([]);
  readonly visited = signal<ReadonlySet<HxStepValue>>(new Set());
  /** Index of the active step, -1 while there is none. */
  readonly activeIndex = computed(() => this.steps().findIndex((s) => s.value() === this.value()));

  constructor() {
    effect(() => {
      const value = this.value();
      const first = this.steps().find((s) => !s.disabled());
      untracked(() => {
        if (value === null) {
          if (first) this.value.set(first.value());
        } else if (!this.visited().has(value)) {
          this.visited.set(new Set([...this.visited(), value]));
        }
      });
    });
  }

  register(step: HxStep): () => void {
    this.steps.update((steps) => [...steps, step]);
    return () => this.steps.update((steps) => steps.filter((s) => s !== step));
  }

  stepId(value: HxStepValue): string {
    return `${this.id}-step-${value}`;
  }

  panelId(value: HxStepValue): string {
    return `${this.id}-panel-${value}`;
  }

  activate(value: HxStepValue): void {
    this.value.set(value);
  }

  /** Activates the step after the active one. */
  next(): void {
    const step = this.steps()[this.activeIndex() + 1];
    if (step) this.activate(step.value());
  }

  /** Activates the step before the active one. */
  previous(): void {
    const step = this.steps()[this.activeIndex() - 1];
    if (step) this.activate(step.value());
  }
}

/** The row of step headers. */
@Component({
  selector: 'hx-step-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-step-list', role: 'list' },
  template: '<ng-content />',
})
export class HxStepList {}

/** The header of one step: a button with the number and the title. */
@Component({
  selector: 'hx-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-step',
    role: 'listitem',
    '[class.hx-step-active]': 'active()',
    '[class.hx-step-completed]': 'completed()',
    '[class.hx-step-disabled]': 'unavailable()',
    '[class.hx-step-last]': 'last()',
  },
  template: `
    <button
      type="button"
      class="hx-step-header"
      [id]="stepper.stepId(value())"
      [disabled]="unavailable()"
      [attr.aria-current]="active() ? 'step' : null"
      [attr.aria-controls]="stepper.panelId(value())"
      (click)="stepper.activate(value())"
    >
      <span class="hx-step-number" aria-hidden="true">
        @if (completed()) {
          <span class="hx-step-check"></span>
        } @else {
          {{ index() + 1 }}
        }
      </span>
      <span class="hx-step-title"><ng-content /></span>
    </button>
    @if (!last()) {
      <span class="hx-step-separator" aria-hidden="true"></span>
    }
  `,
})
export class HxStep {
  protected readonly stepper = inject(HxStepper);
  /** Identifies the step and its panel. */
  readonly value = input.required<HxStepValue>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly index = computed(() => this.stepper.steps().indexOf(this));
  protected readonly last = computed(() => this.index() === this.stepper.steps().length - 1);
  protected readonly active = computed(() => this.stepper.value() === this.value());
  protected readonly completed = computed(
    () => this.stepper.activeIndex() > this.index() && this.index() >= 0,
  );
  /** Disabled by the app, or ahead of the active step in a linear stepper. */
  protected readonly unavailable = computed(
    () => this.disabled() || (this.stepper.linear() && this.index() > this.stepper.activeIndex()),
  );

  constructor() {
    const unregister = this.stepper.register(this);
    inject(DestroyRef).onDestroy(unregister);
  }
}

/** The container of the panels. */
@Component({
  selector: 'hx-step-panels',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-step-panels' },
  template: '<ng-content />',
})
export class HxStepPanels {}

/** Marks the lazy content of a panel: `<ng-template hxStepContent let-activateCallback="activateCallback">`. */
@Directive({ selector: 'ng-template[hxStepContent]' })
export class HxStepContent {
  readonly template = inject<TemplateRef<HxStepContentContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _: HxStepContent,
    context: unknown,
  ): context is HxStepContentContext {
    return true;
  }
}

/** The content of one step. */
@Component({
  selector: 'hx-step-panel',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-step-panel',
    role: 'region',
    '[id]': 'stepper.panelId(value())',
    '[attr.aria-labelledby]': 'stepper.stepId(value())',
    '[hidden]': '!active()',
  },
  template: `
    @if (lazy(); as lazy) {
      @if (render()) {
        <ng-container [ngTemplateOutlet]="lazy.template" [ngTemplateOutletContext]="context()" />
      }
    } @else {
      <ng-content />
    }
  `,
})
export class HxStepPanel {
  protected readonly stepper = inject(HxStepper);
  /** The `value` of the step this panel belongs to. */
  readonly value = input.required<HxStepValue>();
  protected readonly lazy = contentChild(HxStepContent);
  protected readonly context = computed<HxStepContentContext>(() => ({
    activateCallback: (value) => this.stepper.activate(value),
    value: this.value(),
  }));

  protected active(): boolean {
    return this.stepper.value() === this.value();
  }

  protected render(): boolean {
    return this.active() || (this.stepper.keepAlive() && this.stepper.visited().has(this.value()));
  }
}
