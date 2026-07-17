import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'helix-empty',
  standalone: true,
  imports: [],
  templateUrl: './empty.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './empty.scss',
})
export class HelixEmpty {
  title = input('Empty Page');
  description = input('Use this page to start from scratch and place your custom content.');
}
