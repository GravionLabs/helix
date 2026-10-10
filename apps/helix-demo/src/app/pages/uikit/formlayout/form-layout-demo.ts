import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HxButton, HxInput, HxSelect } from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

@Component({
  selector: 'app-formlayout-demo',
  standalone: true,
  imports: [SourceTabsComponent, HxInput, HxButton, HxSelect, FormsModule],
  templateUrl: './form-layout-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './form-layout-demo.scss',
})
export class FormLayoutDemo {
  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' },
  ];

  dropdownItem: string | null = null;
}
