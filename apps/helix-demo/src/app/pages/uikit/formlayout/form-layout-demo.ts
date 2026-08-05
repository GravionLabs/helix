import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@helix/core/button';
import { FluidModule } from '@helix/core/fluid';
import { InputTextModule } from '@helix/core/inputtext';
import { SelectModule } from '@helix/core/select';
import { TextareaModule } from '@helix/core/textarea';

@Component({
  selector: 'app-formlayout-demo',
  standalone: true,
  imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule],
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

  dropdownItem = null;
}
