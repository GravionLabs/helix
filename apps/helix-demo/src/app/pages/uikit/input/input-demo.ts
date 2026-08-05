import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TreeNode } from '@helix/core/api';
import { type AutoCompleteCompleteEvent, AutoCompleteModule } from '@helix/core/autocomplete';
import { ButtonModule } from '@helix/core/button';
import { CheckboxModule } from '@helix/core/checkbox';
import { ColorPickerModule } from '@helix/core/colorpicker';
import { DatePickerModule } from '@helix/core/datepicker';
import { FloatLabelModule } from '@helix/core/floatlabel';
import { FluidModule } from '@helix/core/fluid';
import { IconFieldModule } from '@helix/core/iconfield';
import { InputGroupModule } from '@helix/core/inputgroup';
import { InputGroupAddonModule } from '@helix/core/inputgroupaddon';
import { InputIconModule } from '@helix/core/inputicon';
import { InputNumberModule } from '@helix/core/inputnumber';
import { InputTextModule } from '@helix/core/inputtext';
import { KnobModule } from '@helix/core/knob';
import { ListboxModule } from '@helix/core/listbox';
import { MultiSelectModule } from '@helix/core/multiselect';
import { RadioButtonModule } from '@helix/core/radiobutton';
import { RatingModule } from '@helix/core/rating';
import { SelectModule } from '@helix/core/select';
import { SelectButtonModule } from '@helix/core/selectbutton';
import { SliderModule } from '@helix/core/slider';
import { TextareaModule } from '@helix/core/textarea';
import { ToggleButtonModule } from '@helix/core/togglebutton';
import { ToggleSwitchModule } from '@helix/core/toggleswitch';
import { TreeSelectModule } from '@helix/core/treeselect';
import { CountryService } from '@/app/pages/service/country.service';
import type { Country } from '@/app/pages/service/customer.service';
import { NodeService } from '@/app/pages/service/node.service';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule,
  ],
  templateUrl: './input-demo.html',
  styleUrl: './input-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [CountryService, NodeService],
})
export class InputDemo implements OnInit {
  floatValue: any = null;

  autoValue: any[] | undefined;

  autoFilteredValue: any[] = [];

  selectedAutoValue: any = null;

  calendarValue: any = null;

  inputNumberValue: any = null;

  sliderValue: number = 50;

  ratingValue: any = null;

  colorValue: string = '#1976D2';

  radioValue: any = null;

  checkboxValue: any[] = [];

  switchValue: boolean = false;

  listboxValues: any[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  listboxValue: any = null;

  dropdownValues = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  dropdownValue: any = null;

  multiselectCountries: Country[] = [
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

  multiselectSelectedCountries!: Country[];

  toggleValue: boolean = false;

  selectButtonValue: any = null;

  selectButtonValues: any = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];

  knobValue: number = 50;

  inputGroupValue: boolean = false;

  treeSelectNodes!: TreeNode[];

  selectedNode: any = null;

  countryService = inject(CountryService);

  nodeService = inject(NodeService);

  ngOnInit() {
    this.countryService.getCountries().then((countries) => {
      this.autoValue = countries;
    });

    this.nodeService.getFiles().then((data) => (this.treeSelectNodes = data));
  }

  filterCountry(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.autoValue as any[]).length; i++) {
      const country = (this.autoValue as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(country);
      }
    }

    this.autoFilteredValue = filtered;
  }
}
