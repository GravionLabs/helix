import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GvFooterColumn } from './footer.model';

export type { GvFooterLink } from './footer.model';
export type { GvFooterColumn };

@Component({
  standalone: true,
  selector: 'gv-footer',
  imports: [RouterModule, SlicePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class GvFooter {
  brandName = input('SAKAI');
  brandUrl = input('https://primeng.org');
  columns = input<GvFooterColumn[]>([]);
}
