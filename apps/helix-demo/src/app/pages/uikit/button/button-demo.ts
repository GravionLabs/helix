import { Component, type OnInit } from '@angular/core';
import type { MenuItem } from '@gravionlabs/helix/api';
import { ButtonModule } from '@gravionlabs/helix/button';
import { ButtonGroupModule } from '@gravionlabs/helix/buttongroup';
import { SplitButtonModule } from '@gravionlabs/helix/splitbutton';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [ButtonModule, ButtonGroupModule, SplitButtonModule],
  templateUrl: './button-demo.html',
  styleUrl: './button-demo.scss',
})
export class ButtonDemo implements OnInit {
  items: MenuItem[] = [];

  loading = [false, false, false, false];

  ngOnInit() {
    this.items = [
      { label: 'Update', icon: 'pi pi-refresh' },
      { label: 'Delete', icon: 'pi pi-times' },
      { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
      { separator: true },
      { label: 'Setup', icon: 'pi pi-cog' },
    ];
  }

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => (this.loading[index] = false), 1000);
  }
}
