import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TreeNode } from '@gravionlabs/helix/api';
import {
  type AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from '@gravionlabs/helix/autocomplete';
import { ButtonModule } from '@gravionlabs/helix/button';
import { CheckboxModule } from '@gravionlabs/helix/checkbox';
import { ColorPickerModule } from '@gravionlabs/helix/colorpicker';
import { DatePickerModule } from '@gravionlabs/helix/datepicker';
import { FloatLabelModule } from '@gravionlabs/helix/floatlabel';
import { FluidModule } from '@gravionlabs/helix/fluid';
import { IconFieldModule } from '@gravionlabs/helix/iconfield';
import { InputGroupModule } from '@gravionlabs/helix/inputgroup';
import { InputGroupAddonModule } from '@gravionlabs/helix/inputgroupaddon';
import { InputIconModule } from '@gravionlabs/helix/inputicon';
import { InputNumberModule } from '@gravionlabs/helix/inputnumber';
import { InputTextModule } from '@gravionlabs/helix/inputtext';
import { KnobModule } from '@gravionlabs/helix/knob';
import { ListboxModule } from '@gravionlabs/helix/listbox';
import { MultiSelectModule } from '@gravionlabs/helix/multiselect';
import { RadioButtonModule } from '@gravionlabs/helix/radiobutton';
import { RatingModule } from '@gravionlabs/helix/rating';
import { SelectModule } from '@gravionlabs/helix/select';
import { SelectButtonModule } from '@gravionlabs/helix/selectbutton';
import { SliderModule } from '@gravionlabs/helix/slider';
import { TextareaModule } from '@gravionlabs/helix/textarea';
import { ToggleButtonModule } from '@gravionlabs/helix/togglebutton';
import { ToggleSwitchModule } from '@gravionlabs/helix/toggleswitch';
import { TreeSelectModule } from '@gravionlabs/helix/treeselect';
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
