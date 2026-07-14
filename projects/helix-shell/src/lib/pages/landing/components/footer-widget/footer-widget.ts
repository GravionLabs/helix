import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import type {
  HelixFooterColumn,
  HelixFooterLink,
} from '../../../../layout/components/footer/footer.model';

const DEFAULT_COLUMNS: HelixFooterColumn[] = [
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

export type { HelixFooterColumn, HelixFooterLink };

@Component({
  selector: 'helix-footer-widget',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer-widget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer-widget.scss',
})
export class HelixFooterWidget {
  columns = input<HelixFooterColumn[]>(DEFAULT_COLUMNS);
  homeRoute = input('/landing');
  brandName = input('SAKAI');
}
