import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from '@helix-ui/core/accordion';
import type { MenuItem } from '@helix-ui/core/api';
import { ButtonModule } from '@helix-ui/core/button';
import { DividerModule } from '@helix-ui/core/divider';
import { FieldsetModule } from '@helix-ui/core/fieldset';
import { IconFieldModule } from '@helix-ui/core/iconfield';
import { InputIconModule } from '@helix-ui/core/inputicon';
import { InputTextModule } from '@helix-ui/core/inputtext';
import { MenuModule } from '@helix-ui/core/menu';
import { PanelModule } from '@helix-ui/core/panel';
import { RippleModule } from '@helix-ui/core/ripple';
import { SplitButtonModule } from '@helix-ui/core/splitbutton';
import { SplitterModule } from '@helix-ui/core/splitter';
import { TabsModule } from '@helix-ui/core/tabs';
import { ToolbarModule } from '@helix-ui/core/toolbar';

@Component({
  selector: 'app-panels-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    SplitButtonModule,
    AccordionModule,
    FieldsetModule,
    MenuModule,
    InputTextModule,
    DividerModule,
    SplitterModule,
    PanelModule,
    TabsModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './panels-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './panels-demo.scss',
})
export class PanelsDemo {
  items: MenuItem[] = [
    {
      label: 'Save',
      icon: 'pi pi-check',
    },
    {
      label: 'Update',
      icon: 'pi pi-upload',
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
    },
    {
      label: 'Home Page',
      icon: 'pi pi-home',
    },
  ];
}
