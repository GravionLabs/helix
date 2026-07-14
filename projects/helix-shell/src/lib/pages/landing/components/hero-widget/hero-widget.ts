import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from '@gravionlabs/helix/button';
import { RippleModule } from '@gravionlabs/helix/ripple';

@Component({
  selector: 'helix-hero-widget',
  standalone: true,
  imports: [ButtonModule, RippleModule],
  templateUrl: './hero-widget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero-widget.scss',
})
export class HelixHeroWidget {
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
