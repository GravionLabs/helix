import { Component } from '@angular/core';
import { ButtonModule } from '@gravionlabs/helix/button';
import { MenuModule } from '@gravionlabs/helix/menu';

@Component({
  standalone: true,
  selector: 'app-notifications-widget',
  imports: [ButtonModule, MenuModule],
  templateUrl: './notificationswidget.html',
  styleUrl: './notificationswidget.scss',
})
export class NotificationsWidget {
  items = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
  ];
}
