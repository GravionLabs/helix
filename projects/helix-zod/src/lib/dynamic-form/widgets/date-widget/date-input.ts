import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { type FormValueControl, transformedValue } from '@angular/forms/signals';

function toIsoDate(value: Date): string {
  const y = value.getFullYear().toString().padStart(4, '0');
  const m = (value.getMonth() + 1).toString().padStart(2, '0');
  const d = value.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Native `<input type="date">` exposed as a signal-forms `FormValueControl`
 * with a `Date | null` model — string↔Date conversion via `transformedValue`.
 */
@Component({
  selector: 'helix-date-input',
  standalone: true,
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixDateInput implements FormValueControl<Date | null> {
  readonly value = model.required<Date | null>();
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly touched = model(false);

  protected readonly rawValue = transformedValue(this.value, {
    parse: (raw: string) => {
      if (raw === '') return { value: null };
      const parsed = new Date(`${raw}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) {
        return { error: { kind: 'parse', message: `"${raw}" is not a valid date` } };
      }
      return { value: parsed };
    },
    format: (value) => (value ? toIsoDate(value) : ''),
  });

  protected onInput(event: Event): void {
    this.rawValue.set((event.target as HTMLInputElement).value);
  }

  protected onBlur(): void {
    this.touched.set(true);
  }
}
