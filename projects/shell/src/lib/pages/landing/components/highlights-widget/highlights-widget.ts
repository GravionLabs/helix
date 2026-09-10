import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { HelixHighlight } from '../../landing.model';

const DEFAULT_HIGHLIGHTS: HelixHighlight[] = [
  {
    icon: 'pi pi-fw pi-mobile',
    iconBgClass: 'bg-purple-200',
    iconColorClass: 'text-purple-700',
    title: 'Congue Quisque Egestas',
    description:
      'Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Eget aliquet nibh praesent tristique magna sit amet purus gravida. Sit amet mattis vulputate enim nulla aliquet.',
    imageUrl: 'https://primefaces.org/cdn/templates/sakai/landing/mockup.png',
    imageAlt: 'mockup mobile',
    imageBgClass: 'bg-purple-100',
    imageAlign: 'left',
  },
  {
    icon: 'pi pi-fw pi-desktop',
    iconBgClass: 'bg-yellow-200',
    iconColorClass: 'text-yellow-700',
    title: 'Celerisque Eu Ultrices',
    description:
      'Adipiscing commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero. Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi.',
    imageUrl: 'https://primefaces.org/cdn/templates/sakai/landing/mockup-desktop.png',
    imageAlt: 'mockup',
    imageBgClass: 'bg-yellow-100',
    imageAlign: 'right',
  },
];

@Component({
  selector: 'helix-highlights-widget',
  standalone: true,
  imports: [NgClass],
  templateUrl: './highlights-widget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './highlights-widget.scss',
})
export class HelixHighlightsWidget {
  sectionTitle = input('Powerful Everywhere');
  sectionSubtitle = input('Amet consectetur adipiscing elit...');
  highlights = input<HelixHighlight[]>(DEFAULT_HIGHLIGHTS);
}
