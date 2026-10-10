import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutStore } from '@gravionlabs/helix-shell';
import { HxButton } from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { ShellSection } from '../sections/shell/shell-section';

@Component({
  selector: 'app-topbar-demo',
  standalone: true,
  imports: [ShellSection, SourceTabsComponent, RouterModule, HxButton],
  templateUrl: './topbar-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './topbar-demo.scss',
})
export class TopbarDemo {
  protected store = inject(LayoutStore);
}
