import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxButton, HxMenu, type HxMenuItem } from '@gravionlabs/helix-ui';

@Component({
  standalone: true,
  selector: 'app-best-selling-widget',
  imports: [HxButton, HxMenu],
  templateUrl: './bestsellingwidget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bestsellingwidget.scss',
})
export class BestSellingWidget {
  items: HxMenuItem[] = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
  ];
}
