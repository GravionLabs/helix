import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  standalone: true,
  selector: 'app-best-selling-widget',
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './bestsellingwidget.html',
  styleUrl: './bestsellingwidget.scss',
})
export class BestSellingWidget {
  menu = null;

  items = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
  ];
}
