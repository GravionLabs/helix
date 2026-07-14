import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  templateUrl: './statswidget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './statswidget.scss',
})
export class StatsWidget {}
