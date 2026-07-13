import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutStore } from '@gravionlabs/helix-shell';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar-demo',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './topbar-demo.html',
  styleUrl: './topbar-demo.scss',
})
export class TopbarDemo {
  protected store = inject(LayoutStore);
}
