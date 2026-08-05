import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from '@helix/core/accordion';
import type { MenuItem } from '@helix/core/api';
import { ButtonModule } from '@helix/core/button';
import { DividerModule } from '@helix/core/divider';
import { FieldsetModule } from '@helix/core/fieldset';
import { IconFieldModule } from '@helix/core/iconfield';
import { InputIconModule } from '@helix/core/inputicon';
import { InputTextModule } from '@helix/core/inputtext';
import { MenuModule } from '@helix/core/menu';
import { PanelModule } from '@helix/core/panel';
import { RippleModule } from '@helix/core/ripple';
import { SplitButtonModule } from '@helix/core/splitbutton';
import { SplitterModule } from '@helix/core/splitter';
import { TabsModule } from '@helix/core/tabs';
import { ToolbarModule } from '@helix/core/toolbar';

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
