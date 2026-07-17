import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@gravionlabs/helix/button';
import { LayoutStore } from '@gravionlabs/helix-shell';

@Component({
  selector: 'app-topbar-demo',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './topbar-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './topbar-demo.scss',
})
export class TopbarDemo {
  protected store = inject(LayoutStore);
}
