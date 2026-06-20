import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { HelixMenuItem } from '../menu-item/menu-item';

/** @deprecated Use HelixNavRail instead. HelixMenu is no longer wired into HelixAppLayout. */
@Component({
  selector: 'helix-menu',
  standalone: true,
  imports: [CommonModule, HelixMenuItem, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class HelixMenu {
  model = input<MenuItem[]>([]);
}
