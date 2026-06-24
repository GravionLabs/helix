import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

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
