import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'helix-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HelixSelect),
      multi: true,
    },
  ],
})
export class HelixSelect implements ControlValueAccessor {
  readonly options = input<any[]>([]);
  readonly optionLabel = input<string>('label');
  readonly optionValue = input<string>('value');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);

  readonly value = signal<any>(null);

  protected onChange: (value: any) => void = () => {};
  protected onTouched: () => void = () => {};

  readonly processedOptions = computed(() => {
    const opts = this.options();
    const labelKey = this.optionLabel();
    const valueKey = this.optionValue();

    return opts.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return {
        label: opt[labelKey],
        value: opt[valueKey],
      };
    });
  });

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Disabled state is handled via the [disabled] input binding in the template
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const indexStr = target.value;

    if (indexStr === '') {
      this.value.set(null);
      this.onChange(null);
    } else {
      const index = parseInt(indexStr, 10);
      const selectedOption = this.processedOptions()[index];

      if (selectedOption) {
        this.value.set(selectedOption.value);
        this.onChange(selectedOption.value);
      }
    }
    this.onTouched();
  }

  protected isSelected(optValue: any): boolean {
    return JSON.stringify(this.value()) === JSON.stringify(optValue);
  }
}
