export interface GvNavLink {
  label: string;
  route: string;
  fragment: string;
}

export interface GvFeature {
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  description: string;
  cardStyle?: string;
}

export interface GvTestimonial {
  name: string;
  company: string;
  text: string;
  logoUrl?: string;
}

export interface GvHighlight {
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

export interface GvPricingPlan {
  title: string;
  price: string;
  pricePeriod: string;
  imageUrl: string;
  imageAlt: string;
  buttonLabel: string;
  features: string[];
}
