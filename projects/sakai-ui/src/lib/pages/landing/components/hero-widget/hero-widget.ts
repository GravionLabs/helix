import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'gv-hero-widget',
  standalone: true,
  imports: [ButtonModule, RippleModule],
  templateUrl: './hero-widget.html',
  styleUrl: './hero-widget.scss',
})
export class GvHeroWidget {
  headlineLight = input('Eu sem integer');
  headline = input('eget magna fermentum');
  description = input(
    'Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer. Placerat in egestas erat...',
  );
  buttonLabel = input('Get Started');
  imageUrl = input('https://primefaces.org/cdn/templates/sakai/landing/screen-1.png');
  imageAlt = input('Hero Image');

  buttonClick = output<void>();
}
