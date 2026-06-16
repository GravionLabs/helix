import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { HelixFooterColumn } from './footer.model';

export type { HelixFooterLink } from './footer.model';
export type { HelixFooterColumn };

@Component({
  standalone: true,
  selector: 'helix-footer',
  imports: [RouterModule, SlicePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class HelixFooter {
  brandName = input('Helix');
  brandUrl = input('https://primeng.org');
  columns = input<HelixFooterColumn[]>([]);
}
