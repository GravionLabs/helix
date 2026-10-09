import { CdkListbox, CdkOption, type ListboxValueChangeEvent } from '@angular/cdk/listbox';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  Injector,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { nextId } from '../internal/ids';
import { type Accessor, compareValues, type HxOption, resolveOptions } from '../internal/options';

export type HxSelectSize = 'small' | 'medium' | 'large';
export type HxSelectVariant = 'outlined' | 'filled';

/** An option as the select works with it, after `optionLabel`/`optionValue`/`optionDisabled` are applied. */
export type HxSelectItem<V = unknown> = HxOption<V>;

/**
 * A single-value select: a `combobox` button that opens a listbox in a CDK connected overlay (typeahead,
 * Arrow/Home/End/Enter/Escape from the CDK listbox). A real form control for template-driven, reactive and
 * signal forms.
 *
 * ```html
 * <label for="city">City</label>
 * <hx-select inputId="city" [options]="cities" optionLabel="name" optionValue="code"
 *            placeholder="Select a city" [(ngModel)]="city" />
 * <hx-select [options]="['Small', 'Medium', 'Large']" [formField]="form.size" />
 * ```
 *
 * `options` may hold primitives (label = the value as text) or objects (`optionLabel`, `optionValue` and
 * `optionDisabled` name a key or give a function; defaults `label`, `value` and `disabled`).
 * Give the select a visible `<label for>` (with `inputId`) or an `ariaLabel`.
 */
@Component({
  selector: 'hx-select',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, CdkListbox, CdkOption],
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxSelect), multi: true }],
  host: {
    class: 'hx-select',
    '[class.hx-select-open]': 'open()',
    '[class.hx-select-filled]': "variant() === 'filled'",
    '[class.hx-select-sm]': "size() === 'small'",
    '[class.hx-select-lg]': "size() === 'large'",
    '[class.hx-select-fluid]': 'fluid()',
    '[class.hx-select-disabled]': 'isDisabled()',
    '[class.hx-select-has-clear]': 'canClear()',
    '[class.hx-select-invalid]': 'invalid()',
    '[class.hx-filled]': '!!selected()',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class HxSelect<V = unknown> implements ControlValueAccessor, FormValueControl<V | null> {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  /** The options: primitives or objects. */
  readonly options = input<readonly unknown[]>([]);
  readonly optionLabel = input<Accessor<never, string>>('label');
  readonly optionValue = input<Accessor<never, unknown>>('value');
  readonly optionDisabled = input<Accessor<never, boolean>>('disabled');
  readonly placeholder = input('');
  readonly emptyMessage = input('No options');
  readonly size = input<HxSelectSize>('medium');
  readonly variant = input<HxSelectVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  /** Shows a button that resets the value to `null`. */
  readonly showClear = input(false, { transform: booleanAttribute });
  /** The `id` of the trigger, for a `<label for>`. */
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  /** How values are compared to find the selected option (default: `Object.is`). */
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(compareValues);

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<V | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly open = signal(false);
  protected readonly panelWidth = signal(0);
  protected readonly panelId = nextId('hx-select-panel');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
  ];

  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly listbox = viewChild(CdkListbox);

  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  protected readonly items = computed<HxSelectItem[]>(() =>
    resolveOptions(this.options(), this.optionLabel(), this.optionValue(), this.optionDisabled()),
  );

  protected readonly selected = computed(() => {
    const compare = this.compareWith();
    const current = this.value();
    return current === null ? undefined : this.items().find((item) => compare(item.value, current));
  });

  protected readonly canClear = computed(
    () => this.showClear() && !!this.selected() && !this.isDisabled(),
  );

  protected readonly selectedValues = computed(() => {
    const item = this.selected();
    return item ? [item.value] : [];
  });

  #onChange: (value: V | null) => void = () => {};
  #onTouched: () => void = () => {};

  // ControlValueAccessor (template-driven and reactive forms)
  writeValue(value: V | null): void {
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: V | null) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  /** Focuses the trigger (signal forms call this to focus the control). */
  focus(options?: FocusOptions): void {
    this.trigger().nativeElement.focus(options);
  }

  protected toggle(): void {
    if (this.open()) this.close();
    else this.show();
  }

  protected show(): void {
    if (this.isDisabled() || this.open()) return;
    this.panelWidth.set(this.#host.nativeElement.getBoundingClientRect().width);
    this.open.set(true);
  }

  protected close(refocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) this.focus();
  }

  protected onAttach(): void {
    // the listbox lives in the overlay template: focus it once it has rendered
    afterNextRender(() => this.listbox()?.focus(), { injector: this.#injector });
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.show();
    }
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    } else if (event.key === 'Tab') {
      this.close();
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    if (!this.#host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected onSelect(event: ListboxValueChangeEvent<unknown>): void {
    const [picked] = event.value;
    this.#commit((picked ?? null) as V | null);
    this.close(true);
  }

  protected clear(event: Event): void {
    event.stopPropagation();
    this.#commit(null);
    this.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this.open() || (next && this.#host.nativeElement.contains(next))) return;
    this.#touched();
  }

  #commit(value: V | null): void {
    this.value.set(value);
    this.#onChange(value);
  }

  #touched(): void {
    this.#onTouched();
    this.touch.emit();
  }
}
