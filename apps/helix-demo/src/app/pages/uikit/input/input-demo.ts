import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TreeNode } from '@helix-ui/core/api';
import { type AutoCompleteCompleteEvent, AutoCompleteModule } from '@helix-ui/core/autocomplete';
import { ButtonModule } from '@helix-ui/core/button';
import { CheckboxModule } from '@helix-ui/core/checkbox';
import { ColorPickerModule } from '@helix-ui/core/colorpicker';
import { DatePickerModule } from '@helix-ui/core/datepicker';
import { FloatLabelModule } from '@helix-ui/core/floatlabel';
import { FluidModule } from '@helix-ui/core/fluid';
import { IconFieldModule } from '@helix-ui/core/iconfield';
import { InputGroupModule } from '@helix-ui/core/inputgroup';
import { InputGroupAddonModule } from '@helix-ui/core/inputgroupaddon';
import { InputIconModule } from '@helix-ui/core/inputicon';
import { InputNumberModule } from '@helix-ui/core/inputnumber';
import { InputTextModule } from '@helix-ui/core/inputtext';
import { KnobModule } from '@helix-ui/core/knob';
import { ListboxModule } from '@helix-ui/core/listbox';
import { MultiSelectModule } from '@helix-ui/core/multiselect';
import { RadioButtonModule } from '@helix-ui/core/radiobutton';
import { RatingModule } from '@helix-ui/core/rating';
import { SelectModule } from '@helix-ui/core/select';
import { SelectButtonModule } from '@helix-ui/core/selectbutton';
import { SliderModule } from '@helix-ui/core/slider';
import { TextareaModule } from '@helix-ui/core/textarea';
import { ToggleButtonModule } from '@helix-ui/core/togglebutton';
import { ToggleSwitchModule } from '@helix-ui/core/toggleswitch';
import { TreeSelectModule } from '@helix-ui/core/treeselect';
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
