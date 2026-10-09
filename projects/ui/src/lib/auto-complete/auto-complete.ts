import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
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
import { nextId } from '../internal/ids';
import { type Accessor, compareValues, type HxOption, resolveOptions } from '../internal/options';

export type HxAutoCompleteSize = 'small' | 'medium' | 'large';

/** The event of `(complete)`: the text to find suggestions for. */
export interface HxAutoCompleteEvent {
  query: string;
}

/**
 * A text field that suggests values while the user types. The component does not search: it emits `(complete)` with
 * the query (after `delay` ms and `minLength` characters) and shows the `suggestions` the app sets in answer.
 *
 * ```html
 * <label for="country">Country</label>
 * <hx-auto-complete inputId="country" [suggestions]="found()" optionLabel="name" (complete)="search($event.query)"
 *                   forceSelection dropdown [(ngModel)]="country" />
 * ```
 *
 * The value is the chosen suggestion (an array with `multiple`, shown as removable chips); without
 * `forceSelection` it is the typed text while nothing is chosen. A combobox with `aria-autocomplete="list"` and
 * `aria-activedescendant`; the number of results is announced in a polite live region. It works with `ngModel`,
 * reactive forms and signal forms (`[formField]`).
 */
@Component({
  selector: 'hx-auto-complete',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  templateUrl: './auto-complete.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxAutoComplete), multi: true },
  ],
  host: {
    class: 'hx-auto-complete',
    '[class.hx-auto-complete-open]': 'open()',
    '[class.hx-auto-complete-sm]': "size() === 'small'",
    '[class.hx-auto-complete-lg]': "size() === 'large'",
    '[class.hx-auto-complete-fluid]': 'fluid()',
    '[class.hx-auto-complete-disabled]': 'isDisabled()',
    '[class.hx-auto-complete-invalid]': 'invalid()',
    '[class.hx-auto-complete-has-dropdown]': 'dropdown()',
    '[class.hx-filled]': 'filled()',
  },
})
export class HxAutoComplete<V = unknown>
  implements ControlValueAccessor, FormValueControl<unknown>
{
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #destroyRef = inject(DestroyRef);

  /** The suggestions to show: primitives or objects. Set them in answer to `(complete)`. */
  readonly suggestions = input<readonly unknown[]>([]);
  /** The property (or function) that gives the text of a suggestion. */
  readonly optionLabel = input<Accessor<never, string>>('label');
  readonly optionDisabled = input<Accessor<never, boolean>>('disabled');
  readonly placeholder = input('');
  readonly emptyMessage = input('No results found');
  readonly size = input<HxAutoCompleteSize>('medium');
  readonly fluid = input(false, { transform: booleanAttribute });
  /** The least number of characters before `(complete)` fires (default 1). */
  readonly minLength = input<number | undefined>();
  /** Milliseconds to wait after the last key before `(complete)` fires. */
  readonly delay = input(300, { transform: numberAttribute });
  /** Text that matches no suggestion is cleared when the field loses focus. */
  readonly forceSelection = input(false, { transform: booleanAttribute });
  /** A button that asks for all suggestions (`(complete)` with an empty query). */
  readonly dropdown = input(false, { transform: booleanAttribute });
  /** Several values, shown as removable chips; the value is an array. */
  readonly multiple = input(false, { transform: booleanAttribute });
  /** The `id` of the text field, for a `<label for>`. */
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  /** How values are compared to mark the chosen suggestions (default: `Object.is`). */
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(compareValues);

  /** Fires when the app should look up suggestions for `query`. */
  readonly complete = output<HxAutoCompleteEvent>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<unknown>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly open = signal(false);
  protected readonly active = signal(-1);
  protected readonly panelWidth = signal(0);
  protected readonly panelId = nextId('hx-auto-complete-panel');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
  ];

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  /** The text the user typed, `null` while the field shows the label of the value. */
  readonly #typed = signal<string | null>(null);
  /** Whether a query was answered (the live region and the empty message only speak then). */
  readonly #queried = signal(false);
  #timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly items = computed<HxOption<V>[]>(() =>
    resolveOptions<V>(this.suggestions(), this.optionLabel(), (o) => o, this.optionDisabled()),
  );

  protected readonly chips = computed(() => {
    const value = this.value();
    return this.multiple() && Array.isArray(value) ? value.map((v) => this.#toOption(v)) : [];
  });

  protected readonly inputText = computed(() => {
    const typed = this.#typed();
    if (typed !== null) return typed;
    const value = this.value();
    if (this.multiple() || value === null || value === undefined) return '';
    return this.#toOption(value).label;
  });

  protected readonly filled = computed(() => this.inputText() !== '' || this.chips().length > 0);

  protected readonly activeId = computed(() =>
    this.open() && this.active() >= 0 ? this.optionId(this.active()) : null,
  );

  protected readonly status = computed(() => {
    if (!this.open() && !this.#queried()) return '';
    const count = this.items().length;
    return count === 0 ? this.emptyMessage() : `${count} ${count === 1 ? 'result' : 'results'}`;
  });

  #onChange: (value: unknown) => void = () => {};
  #onTouched: () => void = () => {};

  constructor() {
    this.#destroyRef.onDestroy(() => clearTimeout(this.#timer));
  }

  writeValue(value: unknown): void {
    this.#typed.set(null);
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

  /** Focuses the text field (signal forms call this to focus the control). */
  focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }

  #toOption(value: unknown): HxOption<V> {
    return resolveOptions<V>([value], this.optionLabel(), (o) => o, 'disabled')[0];
  }

  protected optionId(index: number): string {
    return `${this.panelId}-${index}`;
  }

  protected isSelected(item: HxOption<V>): boolean {
    const same = this.compareWith();
    const value = this.value();
    return this.multiple()
      ? Array.isArray(value) && value.some((v) => same(v, item.value))
      : value !== null && value !== undefined && same(value, item.value);
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.#typed.set(text);
    if (!this.multiple() && !this.forceSelection()) this.#commit(text === '' ? null : text);
    clearTimeout(this.#timer);
    if (text.length < (this.minLength() ?? 1)) {
      this.open.set(false);
      return;
    }
    this.#timer = setTimeout(() => this.#search(text), this.delay());
  }

  #search(query: string): void {
    this.#queried.set(true);
    this.complete.emit({ query });
    this.active.set(-1);
    this.#show();
  }

  protected showAll(): void {
    if (this.isDisabled()) return;
    this.field().nativeElement.focus();
    this.#search('');
  }

  #show(): void {
    if (this.isDisabled()) return;
    this.panelWidth.set(this.#host.nativeElement.getBoundingClientRect().width);
    this.open.set(true);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.items().length;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.open()) {
          if (count > 0) this.#show();
          return;
        }
        const step = event.key === 'ArrowDown' ? 1 : -1;
        this.active.set(count === 0 ? -1 : (this.active() + step + count) % count);
        break;
      }
      case 'Home':
      case 'End':
        if (this.open() && count > 0) {
          event.preventDefault();
          this.active.set(event.key === 'Home' ? 0 : count - 1);
        }
        break;
      case 'Enter':
        if (this.open() && this.active() >= 0) {
          event.preventDefault();
          this.choose(this.items()[this.active()]);
        }
        break;
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.open.set(false);
        }
        break;
      case 'Backspace':
        if (this.multiple() && this.inputText() === '' && this.chips().length > 0) {
          this.removeChip(this.chips().length - 1);
        }
        break;
      case 'Tab':
        this.open.set(false);
        break;
    }
  }

  protected choose(item: HxOption<V>): void {
    if (item.disabled) return;
    clearTimeout(this.#timer);
    this.#typed.set(null);
    if (this.multiple()) {
      const same = this.compareWith();
      const current = (Array.isArray(this.value()) ? this.value() : []) as unknown[];
      this.#commit(
        current.some((v) => same(v, item.value))
          ? current.filter((v) => !same(v, item.value))
          : [...current, item.value],
      );
      this.#typed.set('');
      this.field().nativeElement.value = '';
    } else {
      this.#commit(item.value);
      this.open.set(false);
    }
    this.field().nativeElement.focus();
  }

  protected removeChip(index: number): void {
    const current = (Array.isArray(this.value()) ? this.value() : []) as unknown[];
    this.#commit(current.filter((_, i) => i !== index));
  }

  protected onOutsideClick(event: MouseEvent): void {
    if (!this.#host.nativeElement.contains(event.target as Node)) this.open.set(false);
  }

  protected onBlur(): void {
    clearTimeout(this.#timer);
    const typed = this.#typed();
    if (typed !== null && this.forceSelection()) {
      // text that is not the label of the value is dropped
      if (this.multiple() || typed !== this.#labelOfValue()) {
        if (!this.multiple()) this.#commit(null);
      }
      this.#typed.set(null);
    } else if (typed === '' && this.multiple()) {
      this.#typed.set(null);
    }
    this.open.set(false);
    this.#onTouched();
    this.touch.emit();
  }

  #labelOfValue(): string {
    const value = this.value();
    return value === null || value === undefined || this.multiple()
      ? ''
      : this.#toOption(value).label;
  }

  #commit(value: unknown): void {
    this.value.set(value);
    this.#onChange(value);
  }
}
