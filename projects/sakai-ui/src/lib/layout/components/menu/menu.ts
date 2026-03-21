import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { GvMenuItem } from '../menu-item/menu-item';

@Component({
  selector: 'gv-menu',
  standalone: true,
  imports: [CommonModule, GvMenuItem, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class GvMenu {
  model = input<MenuItem[]>([]);
}
