import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@helix-ui/core/button';
import { LayoutStore } from '@helix-ui/shell';

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
