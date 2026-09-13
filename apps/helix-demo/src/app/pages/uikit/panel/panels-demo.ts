import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from '@gravionlabs/helix-core/accordion';
import type { MenuItem } from '@gravionlabs/helix-core/api';
import { ButtonModule } from '@gravionlabs/helix-core/button';
import { DividerModule } from '@gravionlabs/helix-core/divider';
import { FieldsetModule } from '@gravionlabs/helix-core/fieldset';
import { IconFieldModule } from '@gravionlabs/helix-core/iconfield';
import { InputIconModule } from '@gravionlabs/helix-core/inputicon';
import { InputTextModule } from '@gravionlabs/helix-core/inputtext';
import { MenuModule } from '@gravionlabs/helix-core/menu';
import { PanelModule } from '@gravionlabs/helix-core/panel';
import { RippleModule } from '@gravionlabs/helix-core/ripple';
import { SplitButtonModule } from '@gravionlabs/helix-core/splitbutton';
import { SplitterModule } from '@gravionlabs/helix-core/splitter';
import { TabsModule } from '@gravionlabs/helix-core/tabs';
import { ToolbarModule } from '@gravionlabs/helix-core/toolbar';

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
