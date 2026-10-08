import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HxButton, HxDivider } from '@gravionlabs/helix-ui';
import type { HelixPricingPlan } from '../../landing.model';

const DEFAULT_PLANS: HelixPricingPlan[] = [
  {
    title: 'Free',
    price: '$0',
    pricePeriod: 'per month',
    imageUrl: 'https://primefaces.org/cdn/templates/sakai/landing/free.svg',
    imageAlt: 'free',
    buttonLabel: 'Get Started',
    features: [
      'Responsive Layout',
      'Unlimited Push Messages',
      '50 Support Ticket',
      'Free Shipping',
    ],
  },
  {
    title: 'Startup',
    price: '$1',
    pricePeriod: 'per month',
    imageUrl: 'https://primefaces.org/cdn/templates/sakai/landing/startup.svg',
    imageAlt: 'startup',
    buttonLabel: 'Get Started',
    features: [
      'Responsive Layout',
      'Unlimited Push Messages',
      '50 Support Ticket',
      'Free Shipping',
    ],
  },
  {
    title: 'Enterprise',
    price: '$5',
    pricePeriod: 'per month',
    imageUrl: 'https://primefaces.org/cdn/templates/sakai/landing/enterprise.svg',
    imageAlt: 'enterprise',
    buttonLabel: 'Try Free',
    features: [
      'Responsive Layout',
      'Unlimited Push Messages',
      '50 Support Ticket',
      'Free Shipping',
    ],
  },
];

@Component({
  selector: 'helix-pricing-widget',
  standalone: true,
  imports: [HxDivider, HxButton],
  templateUrl: './pricing-widget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pricing-widget.scss',
})
export class HelixPricingWidget {
  sectionTitle = input('Matchless Pricing');
  sectionSubtitle = input('Amet consectetur adipiscing elit...');
  plans = input<HelixPricingPlan[]>(DEFAULT_PLANS);

  planSelect = output<HelixPricingPlan>();
}
