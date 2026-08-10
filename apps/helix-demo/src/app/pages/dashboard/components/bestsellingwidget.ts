import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from '@helix-ui/core/button';
import { MenuModule } from '@helix-ui/core/menu';

@Component({
  standalone: true,
  selector: 'app-best-selling-widget',
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './bestsellingwidget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bestsellingwidget.scss',
})
export class BestSellingWidget {
  menu = null;

  items = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
  ];
}
