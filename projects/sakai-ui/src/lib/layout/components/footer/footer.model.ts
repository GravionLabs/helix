export interface GvFooterLink {
  label: string;
  url?: string;
  route?: string;
}

export interface GvFooterColumn {
  title: string;
  links: GvFooterLink[];
}
