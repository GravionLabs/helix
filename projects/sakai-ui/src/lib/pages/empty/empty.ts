import { Component, input } from '@angular/core';

@Component({
  selector: 'gv-empty',
  standalone: true,
  imports: [],
  templateUrl: './empty.html',
  styleUrl: './empty.scss',
})
export class GvEmpty {
  title = input('Empty Page');
  description = input('Use this page to start from scratch and place your custom content.');
}
