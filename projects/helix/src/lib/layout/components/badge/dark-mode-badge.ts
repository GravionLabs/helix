import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LayoutStore } from '../../store/layout.store';

@Component({
  selector: 'helix-dark-mode-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="layout-topbar-action" (click)="store.toggleDarkMode()">
      <i
        [ngClass]="{
          pi: true,
          'pi-moon': store.isDarkTheme(),
          'pi-sun': !store.isDarkTheme(),
        }"
        style="font-size: 1.4rem;"
      ></i>
    </button>
  `,
  host: {
    style:
      'display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; cursor: pointer; transition: background-color var(--element-transition-duration);',
  },
  styles: [
    `
      :host(:hover) {
        background-color: var(--surface-hover);
      }
      button {
        cursor: pointer;
      }
      button i {
        cursor: inherit;
      }
    `,
  ],
})
export class HelixDarkModeBadge {
  protected store = inject(LayoutStore);
}
