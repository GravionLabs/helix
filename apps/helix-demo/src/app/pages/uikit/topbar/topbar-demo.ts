import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutStore } from '@gravionlabs/helix-shell';
import { HxButton } from '@gravionlabs/helix-ui';

@Component({
  selector: 'app-topbar-demo',
  standalone: true,
  imports: [RouterModule, HxButton],
  templateUrl: './topbar-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './topbar-demo.scss',
})
export class TopbarDemo {
  protected store = inject(LayoutStore);
}
