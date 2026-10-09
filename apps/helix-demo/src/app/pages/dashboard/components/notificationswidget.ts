import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxButton, HxMenu, type HxMenuItem } from '@gravionlabs/helix-ui';

@Component({
  standalone: true,
  selector: 'app-notifications-widget',
  imports: [HxButton, HxMenu],
  templateUrl: './notificationswidget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './notificationswidget.scss',
})
export class NotificationsWidget {
  items: HxMenuItem[] = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
  ];
}
