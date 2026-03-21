import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutStore } from '../../store/layout.store';
import { GvFooter } from '../footer/footer';
import { GvSidebar } from '../sidebar/sidebar';
import { GvTopbar } from '../topbar/topbar';

@Component({
  selector: 'gv-app-layout',
  standalone: true,
  imports: [CommonModule, GvTopbar, GvSidebar, RouterModule, GvFooter],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class GvAppLayout {
  appTitle = input('SAKAI');

  store = inject(LayoutStore);

  constructor() {
    effect(() => {
      if (this.store.mobileMenuActive()) {
        document.body.classList.add('blocked-scroll');
      } else {
        document.body.classList.remove('blocked-scroll');
      }
    });
  }

  containerClass = computed(() => ({
    'layout-overlay': this.store.menuMode() === 'overlay',
    'layout-static': this.store.menuMode() === 'static',
    'layout-static-inactive':
      this.store.staticMenuDesktopInactive() && this.store.menuMode() === 'static',
    'layout-overlay-active': this.store.overlayMenuActive(),
    'layout-mobile-active': this.store.mobileMenuActive(),
  }));
}
