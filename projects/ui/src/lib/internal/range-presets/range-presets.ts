import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { HxDateTimeRangePreset } from '../../date-range-presets/date-range-presets';
import { HxSelect } from '../../select/select';

/**
 * Internal: the preset list of the range pickers (`hx-date-picker` in range mode, `hx-date-time-range-picker`),
 * as a group of native buttons or as one `hx-select`. It only shows the presets and reports a choice; the picker
 * applies it. The select shows `selected`: a choice the picker refuses (`selected` stays) is put back.
 */
@Component({
  selector: 'hx-range-presets',
  imports: [HxSelect],
  template: `
    @if (display() === 'select') {
      <hx-select
        class="hx-range-preset-select"
        fluid
        [options]="presets()"
        optionLabel="label"
        [optionValue]="presetValue"
        [placeholder]="label()"
        [ariaLabel]="label()"
        [ariaDescribedby]="describedBy()"
        [disabled]="disabled()"
        [value]="selected()"
        (valueChange)="chooseInSelect($event)"
      />
    } @else {
      @for (preset of presets(); track $index) {
        <button
          type="button"
          class="hx-date-picker-button hx-range-preset"
          [disabled]="disabled()"
          [attr.aria-describedby]="describedBy()"
          (click)="chosen.emit(preset)"
        >
          {{ preset.label }}
        </button>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-range-presets',
    '[class.hx-range-presets-select]': "display() === 'select'",
    '[attr.role]': "display() === 'select' ? null : 'group'",
    '[attr.aria-label]': "display() === 'select' ? null : label()",
  },
})
export class HxRangePresets {
  readonly presets = input.required<readonly HxDateTimeRangePreset[]>();
  /** A row of `buttons` or one `select`. */
  readonly display = input<'buttons' | 'select'>('buttons');
  /** The name of the button group, or the select's name and placeholder. */
  readonly label = input('Presets');
  readonly disabled = input(false, { transform: booleanAttribute });
  /** The preset the select shows (`null`: the placeholder). */
  readonly selected = input<HxDateTimeRangePreset | null>(null);
  /** The `id` of a message about the last choice (a refused preset) for the buttons and the select. */
  readonly describedBy = input<string | null>(null);
  /** A preset was chosen (a button or an entry of the select). */
  readonly chosen = output<HxDateTimeRangePreset>();

  private readonly select = viewChild(HxSelect);
  /** The value of an option of the select: the preset itself. */
  protected readonly presetValue = (preset: HxDateTimeRangePreset) => preset;

  /** Set while the select is put back, whose model then reports the change again. */
  #restoring = false;

  protected chooseInSelect(preset: unknown): void {
    if (!preset || this.#restoring) return;
    this.chosen.emit(preset as HxDateTimeRangePreset);
    // the select shows what the picker says: a taken preset arrives through `selected`, a refused one is undone
    this.#restoring = true;
    try {
      this.select()?.value.set(this.selected());
    } finally {
      this.#restoring = false;
    }
  }
}
