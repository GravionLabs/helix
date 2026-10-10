import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelixStatCard } from '@gravionlabs/helix-shell';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [HelixStatCard],
  templateUrl: './statswidget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './statswidget.scss',
})
export class StatsWidget {}
