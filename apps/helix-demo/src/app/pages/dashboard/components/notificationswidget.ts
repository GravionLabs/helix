import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from '@helix-ui/core/button';
import { MenuModule } from '@helix-ui/core/menu';

@Component({
  standalone: true,
  selector: 'app-notifications-widget',
  imports: [ButtonModule, MenuModule],
  templateUrl: './notificationswidget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './notificationswidget.scss',
})
export class NotificationsWidget {
  items = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
  ];
}
