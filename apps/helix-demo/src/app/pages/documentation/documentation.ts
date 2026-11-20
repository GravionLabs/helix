import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentation.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Documentation {}
