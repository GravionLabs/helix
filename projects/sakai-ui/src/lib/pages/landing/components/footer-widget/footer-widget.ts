import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GvFooterColumn, GvFooterLink } from '../../../../layout/components/footer/footer.model';

const DEFAULT_COLUMNS: GvFooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us' },
      { label: 'News' },
      { label: 'Investor Relations' },
      { label: 'Careers' },
      { label: 'Media Kit' },
    ],
  },
  {
    title: 'Resources',
    links: [{ label: 'Get Started' }, { label: 'Learn' }, { label: 'Case Studies' }],
  },
  {
    title: 'Community',
    links: [{ label: 'Discord' }, { label: 'Events' }, { label: 'FAQ' }, { label: 'Blog' }],
  },
  {
    title: 'Legal',
    links: [{ label: 'Brand Policy' }, { label: 'Privacy Policy' }, { label: 'Terms of Service' }],
  },
];

export type { GvFooterColumn, GvFooterLink };

@Component({
  selector: 'gv-footer-widget',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer-widget.html',
  styleUrl: './footer-widget.scss',
})
export class GvFooterWidget {
  columns = input<GvFooterColumn[]>(DEFAULT_COLUMNS);
  homeRoute = input('/landing');
  brandName = input('SAKAI');
}
