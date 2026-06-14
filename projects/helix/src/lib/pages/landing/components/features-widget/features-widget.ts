import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import type { HelixFeature, HelixTestimonial } from '../../landing.model';

const DEFAULT_FEATURES: HelixFeature[] = [
  {
    icon: 'pi pi-fw pi-users',
    iconBgClass: 'bg-yellow-200',
    iconColorClass: 'text-yellow-700',
    title: 'Easy to Use',
    description: 'Posuere morbi leo urna molestie.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(253,228,165,.2), rgba(187,199,205,.2)), linear-gradient(180deg, rgba(253,228,165,.2), rgba(187,199,205,.2));',
  },
  {
    icon: 'pi pi-fw pi-palette',
    iconBgClass: 'bg-cyan-200',
    iconColorClass: 'text-cyan-700',
    title: 'Fresh Design',
    description: 'Semper risus in hendrerit.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(145,226,237,.2), rgba(251,199,145,.2)), linear-gradient(180deg, rgba(253,228,165,.2), rgba(172,180,223,.2));',
  },
  {
    icon: 'pi pi-fw pi-map',
    iconBgClass: 'bg-indigo-200',
    iconColorClass: 'text-indigo-700',
    title: 'Well Documented',
    description: 'Non arcu risus quis varius quam quisque.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(145,226,237,.2), rgba(172,180,223,.2)), linear-gradient(180deg, rgba(172,180,223,.2), rgba(246,158,188,.2));',
  },
  {
    icon: 'pi pi-fw pi-id-card',
    iconBgClass: 'bg-slate-200',
    iconColorClass: 'text-slate-700',
    title: 'Compatibility',
    description: 'Leo in vitae turpis massa sed.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(187,199,205,.2), rgba(251,199,145,.2)), linear-gradient(180deg, rgba(187,199,205,.2), rgba(145,210,204,.2));',
  },
  {
    icon: 'pi pi-fw pi-star',
    iconBgClass: 'bg-orange-200',
    iconColorClass: 'text-orange-700',
    title: 'Fast Support',
    description: 'Orci nulla pellentesque dignissim enim.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(251,199,145,.2), rgba(253,228,165,.2)), linear-gradient(180deg, rgba(172,180,223,.2), rgba(246,158,188,.2));',
  },
  {
    icon: 'pi pi-fw pi-moon',
    iconBgClass: 'bg-pink-200',
    iconColorClass: 'text-pink-700',
    title: 'Powered by Angular',
    description: 'Curabitur gravida arcu ac tortor.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(246,158,188,.2), rgba(212,162,221,.2)), linear-gradient(180deg, rgba(253,228,165,.2), rgba(172,180,223,.2));',
  },
  {
    icon: 'pi pi-fw pi-shopping-cart',
    iconBgClass: 'bg-teal-200',
    iconColorClass: 'text-teal-700',
    title: 'PrimeNG Components',
    description: 'Feugiat pretium nibh ipsum consequat.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(145,210,204,.2), rgba(160,210,250,.2)), linear-gradient(180deg, rgba(187,199,205,.2), rgba(145,210,204,.2));',
  },
  {
    icon: 'pi pi-fw pi-globe',
    iconBgClass: 'bg-blue-200',
    iconColorClass: 'text-blue-700',
    title: 'Mobile Responsive',
    description: 'Amet nisl suscipit adipiscing bibendum.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(160,210,250,.2), rgba(212,162,221,.2)), linear-gradient(180deg, rgba(246,158,188,.2), rgba(212,162,221,.2));',
  },
  {
    icon: 'pi pi-fw pi-eye',
    iconBgClass: 'bg-purple-200',
    iconColorClass: 'text-purple-700',
    title: 'Privacy',
    description: 'Neque egestas congue quisque.',
    cardStyle:
      'background: linear-gradient(90deg, rgba(160,210,250,.2), rgba(212,162,221,.2)), linear-gradient(180deg, rgba(246,158,188,.2), rgba(212,162,221,.2));',
  },
];

const DEFAULT_TESTIMONIAL: HelixTestimonial = {
  name: 'Joséphine Miller',
  company: 'Peak Interactive',
  text: '"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
  logoUrl: 'https://primefaces.org/cdn/templates/sakai/landing/peak-logo.svg',
};

@Component({
  selector: 'helix-features-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-widget.html',
  styleUrl: './features-widget.scss',
})
export class HelixFeaturesWidget {
  sectionTitle = input('Marvelous Features');
  sectionSubtitle = input('Placerat in egestas erat...');
  features = input<HelixFeature[]>(DEFAULT_FEATURES);
  testimonial = input<HelixTestimonial | null>(DEFAULT_TESTIMONIAL);
}
