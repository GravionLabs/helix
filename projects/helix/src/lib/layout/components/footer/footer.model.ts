export interface HelixFooterLink {
  label: string;
  url?: string;
  route?: string;
}

export interface HelixFooterColumn {
  title: string;
  links: HelixFooterLink[];
}
