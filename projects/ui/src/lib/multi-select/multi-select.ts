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
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { HxCheckbox } from '../checkbox/checkbox';
import { nextId } from '../internal/ids';
import { type Accessor, compareValues, type HxOption, resolveOptions } from '../internal/options';

export type HxMultiSelectSize = 'small' | 'medium' | 'large';
export type HxMultiSelectVariant = 'outlined' | 'filled';
export type HxMultiSelectDisplay = 'comma' | 'chip';

/**
 * A select for several values: a `combobox` that opens a multi-select listbox in a CDK connected overlay. The panel
 * stays open while the user chooses; Escape and a click outside close it. The value is an array of option values.
 *
 * ```html
 * <label for="cities">Cities</label>
 * <hx-multi-select inputId="cities" [options]="cities" optionLabel="name" optionValue="code" display="chip"
 *                  filter showToggleAll [(ngModel)]="visited" />
 * ```
 *
 * `display="comma"` lists the labels, `chip` shows a removable chip per value; beyond `maxSelectedLabels` both show
 * `selectedItemsLabel` ("3 items selected"). It works with `ngModel`, reactive forms and signal forms
 * (`[formField]`). Give it a visible `<label for>` (with `inputId`) or an `ariaLabel`.
 */
@Component({
  selector: 'hx-multi-select',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, CdkListbox, CdkOption, HxCheckbox],
  templateUrl: './multi-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxMultiSelect), multi: true },
  ],
  host: {
    class: 'hx-multi-select',
    '[class.hx-multi-select-open]': 'open()',
    '[class.hx-multi-select-filled]': "variant() === 'filled'",
    '[class.hx-multi-select-sm]': "size() === 'small'",
    '[class.hx-multi-select-lg]': "size() === 'large'",
    '[class.hx-multi-select-fluid]': 'fluid()',
    '[class.hx-multi-select-disabled]': 'isDisabled()',
    '[class.hx-multi-select-has-clear]': 'canClear()',
    '[class.hx-multi-select-invalid]': 'invalid()',
    '[class.hx-filled]': 'selected().length > 0',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class HxMultiSelect<V = unknown> implements ControlValueAccessor, FormValueControl<V[]> {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  /** The options: primitives or objects. */
  readonly options = input<readonly unknown[]>([]);
  readonly optionLabel = input<Accessor<never, string>>('label');
  readonly optionValue = input<Accessor<never, unknown>>('value');
  readonly optionDisabled = input<Accessor<never, boolean>>('disabled');
  readonly placeholder = input('');
  readonly emptyMessage = input('No options');
  readonly size = input<HxMultiSelectSize>('medium');
  readonly variant = input<HxMultiSelectVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  /** `comma`: the labels in a line, `chip`: a removable chip per value. */
  readonly display = input<HxMultiSelectDisplay>('comma');
  /** More values than this show `selectedItemsLabel` instead of the labels. */
  readonly maxSelectedLabels = input(3, { transform: numberAttribute });
  /** Text for many values; `{0}` is the count. */
  readonly selectedItemsLabel = input('{0} items selected');
  /** A text field above the list that narrows the options by label. */
  readonly filter = input(false, { transform: booleanAttribute });
  readonly filterPlaceholder = input('Search');
  /** A checkbox above the list that selects or clears all (visible) options. */
  readonly showToggleAll = input(false, { transform: booleanAttribute });
  readonly toggleAllLabel = input('Select all');
  /** Shows a button that clears the selection. */
  readonly showClear = input(false, { transform: booleanAttribute });
  /** The `id` of the trigger, for a `<label for>`. */
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  /** How values are compared to find the selected options (default: `Object.is`). */
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(compareValues);

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<V[]>([]);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly panelWidth = signal(0);
  protected readonly panelId = nextId('hx-multi-select-panel');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
  ];

  private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
  private readonly listbox = viewChild(CdkListbox);
  private readonly filterField = viewChild<ElementRef<HTMLInputElement>>('filterField');

  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  protected readonly items = computed<HxOption<V>[]>(() =>
    resolveOptions<V>(
      this.options(),
      this.optionLabel(),
      this.optionValue(),
      this.optionDisabled(),
    ),
  );

  protected readonly visibleItems = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query ? this.items().filter((i) => i.label.toLowerCase().includes(query)) : this.items();
  });

  protected readonly selectedValues = computed(() => this.value() ?? []);

  /** The options of the selected values, in the order of the values. */
  protected readonly selected = computed(() => {
    const same = this.compareWith();
    const items = this.items();
    return this.selectedValues()
      .map((v) => items.find((item) => same(item.value, v)))
      .filter((item): item is HxOption<V> => item !== undefined);
  });

  protected readonly commaLabel = computed(() =>
    this.selected()
      .map((i) => i.label)
      .join(', '),
  );

  /** The "n items selected" text, empty while the labels fit. */
  protected readonly summary = computed(() => {
    const count = this.selected().length;
    return count > this.maxSelectedLabels()
      ? this.selectedItemsLabel().replace('{0}', String(count))
      : '';
  });

  protected readonly canClear = computed(
    () => this.showClear() && this.selected().length > 0 && !this.isDisabled(),
  );

  readonly #toggleable = computed(() => this.visibleItems().filter((i) => !i.disabled));
  protected readonly allSelected = computed(() => {
    const same = this.compareWith();
    const rows = this.#toggleable();
    return (
      rows.length > 0 && rows.every((r) => this.selectedValues().some((v) => same(v, r.value)))
    );
  });

  #onChange: (value: V[]) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: V[] | null): void {
    this.value.set(value ?? []);
  }
  registerOnChange(fn: (value: V[]) => void): void {
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
    this.query.set('');
    if (refocus) this.focus();
  }

  protected onAttach(): void {
    // the panel lives in the overlay template: focus the filter, or the list, once it has rendered
    afterNextRender(
      () => {
        const field = this.filterField();
        if (field) field.nativeElement.focus();
        else this.listbox()?.focus();
      },
      { injector: this.#injector },
    );
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.show();
    }
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    } else if (event.key === 'Tab') {
      // the list is the last stop of the panel, the first control the first: leaving either closes the panel
      const panel = (event.target as HTMLElement).closest('.hx-multi-select-panel');
      const stops = panel
        ? [...panel.querySelectorAll<HTMLElement>('input, [role="listbox"]')]
        : [];
      const at = stops.indexOf(event.target as HTMLElement);
      if (event.shiftKey ? at <= 0 : at === stops.length - 1) this.close(event.shiftKey);
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    if (!this.#host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected onSelect(event: ListboxValueChangeEvent<V>): void {
    // work from the clicked option, not from the CDK's value list: that one lacks the selected options the filter hides
    const option = event.option;
    if (!option) return;
    const same = this.compareWith();
    const current = this.selectedValues();
    const chosen = current.some((v) => same(v, option.value));
    this.#commit(
      chosen ? current.filter((v) => !same(v, option.value)) : [...current, option.value],
    );
  }

  protected toggleAll(): void {
    const same = this.compareWith();
    const rows = this.#toggleable();
    const current = this.selectedValues();
    if (this.allSelected()) {
      this.#commit(current.filter((v) => !rows.some((r) => same(r.value, v))));
    } else {
      this.#commit([
        ...current,
        ...rows.filter((r) => !current.some((v) => same(v, r.value))).map((r) => r.value),
      ]);
    }
  }

  protected removeChip(event: Event, item: HxOption<V>): void {
    event.stopPropagation();
    const same = this.compareWith();
    this.#commit(this.selectedValues().filter((v) => !same(v, item.value)));
  }

  protected clear(event: Event): void {
    event.stopPropagation();
    this.#commit([]);
    this.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this.open() || (next && this.#host.nativeElement.contains(next))) return;
    this.#onTouched();
    this.touch.emit();
  }

  #commit(value: V[]): void {
    this.value.set(value);
    this.#onChange(value);
  }
}
