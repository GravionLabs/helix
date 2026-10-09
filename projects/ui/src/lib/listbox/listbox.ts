import { CdkListbox, CdkOption, type ListboxValueChangeEvent } from '@angular/cdk/listbox';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
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

/**
 * An inline list of options, single or `multiple`, on the CDK listbox (`aria-multiselectable`, active
 * descendant, typeahead, arrows, Home, End). With `filter` a text field above the list narrows the options by
 * their label.
 *
 * ```html
 * <hx-listbox ariaLabel="City" [options]="cities" optionLabel="name" optionValue="code" [(ngModel)]="city" />
 * <hx-listbox ariaLabel="Toppings" [options]="toppings" multiple checkmark filter [(value)]="chosen" />
 * ```
 *
 * The value is the option's value, or an array of values with `multiple`. It works with `ngModel`, reactive forms
 * and signal forms (`[formField]`).
 */
@Component({
  selector: 'hx-listbox',
  imports: [CdkListbox, CdkOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxListbox), multi: true },
  ],
  host: {
    class: 'hx-listbox',
    '[class.hx-listbox-disabled]': 'isDisabled()',
    '[class.hx-listbox-invalid]': 'invalid()',
    '[class.hx-listbox-checkmark]': 'checkmark()',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    @if (filter()) {
      <div class="hx-listbox-header">
        <input
          type="text"
          class="hx-listbox-filter"
          autocomplete="off"
          [attr.aria-label]="filterPlaceholder()"
          [attr.aria-controls]="listId"
          [placeholder]="filterPlaceholder()"
          [disabled]="isDisabled()"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
      </div>
    }
    <div class="hx-listbox-scroll" [style.max-height]="scrollHeight()">
      <div
        cdkListbox
        class="hx-listbox-list"
        [id]="listId"
        [cdkListboxMultiple]="multiple()"
        [cdkListboxDisabled]="isDisabled()"
        [cdkListboxValue]="selectedValues()"
        [cdkListboxUseActiveDescendant]="true"
        [cdkListboxCompareWith]="compareWith()"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-labelledby]="ariaLabelledby() ?? null"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        (cdkListboxValueChange)="onSelect($event)"
      >
        @for (item of visibleItems(); track item) {
          <div
            class="hx-listbox-option"
            [cdkOption]="item.value"
            [cdkOptionDisabled]="item.disabled"
            [cdkOptionTypeaheadLabel]="item.label"
          >
            <span class="hx-listbox-check" aria-hidden="true"></span>
            <span>{{ item.label }}</span>
          </div>
        } @empty {
          <div class="hx-listbox-empty">{{ emptyMessage() }}</div>
        }
      </div>
    </div>
  `,
})
export class HxListbox<V = unknown> implements ControlValueAccessor, FormValueControl<unknown> {
  /** The options: primitives or objects. */
  readonly options = input<readonly unknown[]>([]);
  readonly optionLabel = input<Accessor<never, string>>('label');
  readonly optionValue = input<Accessor<never, unknown>>('value');
  readonly optionDisabled = input<Accessor<never, boolean>>('disabled');
  /** Several options can be chosen; the value is then an array. */
  readonly multiple = input(false, { transform: booleanAttribute });
  /** A check in front of the selected options. */
  readonly checkmark = input(false, { transform: booleanAttribute });
  /** A text field above the list that narrows the options by label. */
  readonly filter = input(false, { transform: booleanAttribute });
  readonly filterPlaceholder = input('Filter');
  readonly emptyMessage = input('No options');
  /** Maximum height of the list (a CSS length such as `14rem`); it scrolls beyond. */
  readonly scrollHeight = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  /** How values are compared to find the selected options (default: `Object.is`). */
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(compareValues);

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<unknown>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected readonly listId = nextId('hx-listbox');
  protected readonly query = signal('');
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  private readonly listbox = viewChild(CdkListbox);

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

  protected readonly selectedValues = computed(() => {
    const current = this.value();
    if (this.multiple()) return Array.isArray(current) ? current : [];
    return current === null || current === undefined ? [] : [current];
  });

  #onChange: (value: unknown) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    this.value.set(value ?? (this.multiple() ? [] : null));
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  /** Focuses the list (signal forms call this to focus the control). */
  focus(): void {
    this.listbox()?.focus();
  }

  protected onSelect(event: ListboxValueChangeEvent<unknown>): void {
    // work from the clicked option, not from the CDK's value list: that one lacks the selected options the filter hides
    const option = event.option;
    if (!option) return;
    const same = this.compareWith();
    const current = this.selectedValues();
    const chosen = current.some((v) => same(v, option.value));
    let next: unknown;
    if (this.multiple()) {
      next = chosen ? current.filter((v) => !same(v, option.value)) : [...current, option.value];
    } else if (chosen) {
      // a single list keeps its choice when the chosen option is clicked again
      this.listbox()?.select(option);
      return;
    } else {
      next = option.value;
    }
    this.value.set(next);
    this.#onChange(next);
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    if (host.contains(event.relatedTarget as Node | null)) return;
    this.#onTouched();
    this.touch.emit();
  }
}
