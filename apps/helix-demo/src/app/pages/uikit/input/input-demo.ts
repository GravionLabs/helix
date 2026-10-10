import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HxAutoComplete,
  HxButton,
  HxCheckbox,
  HxDatePicker,
  type HxDatePickerValue,
  HxFloatLabel,
  HxIconField,
  HxInput,
  HxInputGroup,
  HxInputGroupAddon,
  HxInputIcon,
  HxInputNumber,
  HxListbox,
  HxMultiSelect,
  HxRadio,
  HxRating,
  HxSelect,
  HxSelectButton,
  HxSlider,
  type HxSliderValue,
  HxSwitch,
  HxToggleButton,
} from '@gravionlabs/helix-ui';
import { CountryService } from '@/app/pages/service/country.service';
import type { Country } from '@/app/pages/service/customer.service';
import { HxFormSection } from '../sections/form/form-section';
import { HxInputsSection } from '../sections/inputs/inputs-section';
import { HxSelectSection } from '../sections/select/select-section';

/** The input components of `@gravionlabs/helix-ui` (the colour picker, knob and tree select are not part of it). */
@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [
    HxInputsSection,
    HxFormSection,
    HxSelectSection,

    FormsModule,
    HxInput,
    HxButton,
    HxCheckbox,
    HxRadio,
    HxSwitch,
    HxSelectButton,
    HxInputGroup,
    HxInputGroupAddon,
    HxIconField,
    HxInputIcon,
    HxFloatLabel,
    HxAutoComplete,
    HxInputNumber,
    HxSlider,
    HxRating,
    HxSelect,
    HxDatePicker,
    HxToggleButton,
    HxMultiSelect,
    HxListbox,
  ],
  templateUrl: './input-demo.html',
  styleUrl: './input-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [CountryService],
})
export class InputDemo implements OnInit {
  readonly #countries = inject(CountryService);

  floatValue = '';
  allCountries: Country[] = [];
  readonly found = signal<Country[]>([]);
  readonly pickedCountries = signal<unknown>([]);
  readonly date = signal<HxDatePickerValue>(null);
  inputNumberValue: number | null = null;
  readonly sliderValue = signal<HxSliderValue>(50);
  readonly rating = signal<number | null>(null);
  radioValue: string | null = null;
  readonly cityChecks = { Chicago: false, 'Los Angeles': false, 'New York': false };
  readonly cityNames = Object.keys(this.cityChecks) as (keyof typeof this.cityChecks)[];
  switchValue = false;

  readonly cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];
  listboxValue: string | null = null;
  selectValue: string | null = null;

  readonly countries: Country[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
  ];
  multiselectSelected: string[] = [];

  toggleValue = false;
  readonly selectButtonValues = ['Option 1', 'Option 2', 'Option 3'];
  selectButtonValue: string | null = null;
  inputGroupValue = false;

  ngOnInit() {
    this.#countries.getCountries().then((countries) => {
      this.allCountries = countries;
    });
  }

  filterCountry(query: string) {
    this.found.set(
      this.allCountries.filter((c) => c.name?.toLowerCase().startsWith(query.toLowerCase())),
    );
  }
}
