import {
  type AfterContentChecked,
  afterEveryRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  type ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { type AbstractControl, NgControl, Validators } from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import type { Subscription } from 'rxjs';
import { HX_FIELD, type HxFieldContext } from '../internal/field/context';
import { nextId } from '../internal/ids';

interface ControlState {
  invalid: boolean;
  touched: boolean;
  required: boolean;
  message?: string;
}

/**
 * A form field around one control (`hx-input`, `hx-checkbox`, `hx-radio`, `hx-switch` or `hx-select`): the label,
 * the hint, the error and the required marker, with `id`/`for`, `aria-describedby`, `aria-invalid` and
 * `aria-required` wired for it. The control stays what it is, in template-driven, reactive and signal forms.
 *
 * ```html
 * <hx-field label="Email" hint="We never share it">
 *   <input hx-input type="email" [formField]="signup.email" />
 * </hx-field>
 * <hx-field label="Name" error="Enter your name">
 *   <input hx-input formControlName="name" />
 * </hx-field>
 * ```
 *
 * With a form bound to the control, the control is invalid and the error shows once it is invalid and touched.
 * The error is `error`, else (signal forms) the `message` of the field's first error. Without a form, a set
 * `error` shows at once.
 */
@Component({
  selector: 'hx-field',
  exportAs: 'hx-field',
  templateUrl: './field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: HX_FIELD, useExisting: forwardRef(() => HxField) }],
  host: {
    class: 'hx-field',
    '[class.hx-field-invalid]': 'invalid() === true',
  },
})
export class HxField implements HxFieldContext, AfterContentChecked {
  /** The visible label of the control. */
  readonly label = input<string>();
  /** Help text below the control. */
  readonly hint = input<string>();
  /** The error text; it replaces the message of the form's error. */
  readonly error = input<string | null>();
  /** Marks the control as required; a `required` validator or attribute of the control does so as well. */
  readonly required = input(false, { transform: booleanAttribute });

  readonly controlId = nextId('hx-field-control');
  protected readonly hintId = nextId('hx-field-hint');
  protected readonly errorId = nextId('hx-field-error');

  private readonly formField = contentChild(FormField);
  private readonly ngControl = contentChild(NgControl);
  private readonly box = viewChild.required<ElementRef<HTMLElement>>('box');

  /** The host element of the control. */
  readonly control = signal<Element | null>(null);
  /** The id the label points at. */
  protected readonly labelFor = signal<string | null>(null);
  readonly #requiredAttribute = signal(false);

  readonly #reactiveState = signal<ControlState | null>(null, {
    equal: (a, b) =>
      a?.invalid === b?.invalid && a?.touched === b?.touched && a?.required === b?.required,
  });

  /** The state of the form behind the control; `null` without one. */
  readonly #state = computed<ControlState | null>(() => {
    // signal forms also provide an `NgControl`, so their directive comes first
    const field = this.formField();
    if (!field) return this.#reactiveState();
    const state = field.state();
    return {
      invalid: state.invalid(),
      touched: state.touched(),
      required: state.required(),
      message: state.errors()[0]?.message,
    };
  });

  readonly invalid = computed(() => {
    const state = this.#state();
    if (state) return state.invalid && state.touched;
    return this.error() ? true : null;
  });

  readonly isRequired = computed(
    () => this.required() || !!this.#state()?.required || this.#requiredAttribute(),
  );

  protected readonly message = computed(() =>
    this.invalid() ? this.error() || this.#state()?.message || null : null,
  );

  readonly describedBy = computed(
    () =>
      [this.hint() ? this.hintId : null, this.message() ? this.errorId : null]
        .filter(Boolean)
        .join(' ') || null,
  );

  #watched: AbstractControl | null = null;
  #subscription?: Subscription;
  /** The attributes the field itself put on a native control: only those are taken away again. */
  readonly #written = new Set<string>();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.#subscription?.unsubscribe());
    afterEveryRender(() => this.#wire());
  }

  ngAfterContentChecked(): void {
    // reactive and template-driven forms: the control may be set or replaced by any change detection
    const control = this.formField() ? null : (this.ngControl()?.control ?? null);
    if (control !== this.#watched) {
      this.#subscription?.unsubscribe();
      this.#watched = control;
      // touched and status changes made in code (`markAllAsTouched`, `setErrors`) arrive here
      this.#subscription = control?.events.subscribe(() => this.#read(control));
    }
    this.#read(control);
  }

  #read(control: AbstractControl | null): void {
    this.#reactiveState.set(
      control && {
        invalid: control.invalid,
        touched: control.touched,
        // oxlint-disable-next-line typescript/unbound-method -- static validator functions, compared by reference
        required: [Validators.required, Validators.requiredTrue].some((v) =>
          control.hasValidator(v),
        ),
      },
    );
  }

  #wire(): void {
    const control = this.box().nativeElement.querySelector('hx-select, input, textarea, select');
    if (control !== this.control()) {
      this.control.set(control);
      this.#written.clear();
    }
    this.#requiredAttribute.set(!!control?.hasAttribute('required'));
    if (!control) {
      this.labelFor.set(null);
      return;
    }
    // a select binds the context itself: its focusable element is a button in its own template
    if (control.localName === 'hx-select') {
      this.labelFor.set(control.querySelector('.hx-select-trigger')?.id || null);
      return;
    }
    if (!control.id) control.id = this.controlId;
    this.labelFor.set(control.id);
    this.#describe(control);
    this.#flag(control, 'aria-invalid', this.invalid() === true);
    this.#flag(control, 'aria-required', this.isRequired());
  }

  /** Keeps the ids the app put in `aria-describedby` and adds those of the shown texts. */
  #describe(control: Element): void {
    const current = control.getAttribute('aria-describedby');
    const others = (current ?? '')
      .split(/\s+/)
      .filter((id) => id && id !== this.hintId && id !== this.errorId);
    const next = [...others, this.describedBy()].filter(Boolean).join(' ');
    if (next === (current ?? '')) return;
    if (next) control.setAttribute('aria-describedby', next);
    else control.removeAttribute('aria-describedby');
  }

  #flag(control: Element, name: string, on: boolean): void {
    if (on) {
      if (control.getAttribute(name) === 'true') return;
      control.setAttribute(name, 'true');
      this.#written.add(name);
    } else if (this.#written.delete(name)) {
      control.removeAttribute(name);
    }
  }
}
