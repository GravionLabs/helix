import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from '@gravionlabs/helix/accordion';
import type { MenuItem } from '@gravionlabs/helix/api';
import { ButtonModule } from '@gravionlabs/helix/button';
import { DividerModule } from '@gravionlabs/helix/divider';
import { FieldsetModule } from '@gravionlabs/helix/fieldset';
import { IconFieldModule } from '@gravionlabs/helix/iconfield';
import { InputIconModule } from '@gravionlabs/helix/inputicon';
import { InputTextModule } from '@gravionlabs/helix/inputtext';
import { MenuModule } from '@gravionlabs/helix/menu';
import { PanelModule } from '@gravionlabs/helix/panel';
import { RippleModule } from '@gravionlabs/helix/ripple';
import { SplitButtonModule } from '@gravionlabs/helix/splitbutton';
import { SplitterModule } from '@gravionlabs/helix/splitter';
import { TabsModule } from '@gravionlabs/helix/tabs';
import { ToolbarModule } from '@gravionlabs/helix/toolbar';

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
