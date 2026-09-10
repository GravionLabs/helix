export interface HelixNavLink {
  label: string;
  route: string;
  fragment: string;
}

export interface HelixFeature {
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  description: string;
  cardStyle?: string;
}

export interface HelixTestimonial {
  name: string;
  company: string;
  text: string;
  logoUrl?: string;
}

export interface HelixHighlight {
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageBgClass: string;
  imageAlign: 'left' | 'right';
}

export interface HelixPricingPlan {
  title: string;
  price: string;
  pricePeriod: string;
  imageUrl: string;
  imageAlt: string;
  buttonLabel: string;
  features: string[];
}
