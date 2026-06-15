import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LayoutStore } from '@gravionlabs/helix';

@Component({
  selector: 'app-topbar-demo',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  template: `
    <div class="card">
      <h2>Topbar Controls</h2>
      <p>Use the buttons below to interact with topbar features.</p>

      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="card flex justify-content-center">
            <p-button
              [label]="store.isCollapsed() ? 'Expand Sidebar' : 'Collapse Sidebar'"
              icon="pi pi-angle-double-left"
              severity="secondary"
              (onClick)="store.toggleSidebar()"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="card flex justify-content-center">
            <p-button
              [label]="store.isDarkTheme() ? 'Light Mode' : 'Dark Mode'"
              [icon]="store.isDarkTheme() ? 'pi pi-sun' : 'pi pi-moon'"
              severity="secondary"
              (onClick)="store.toggleDarkMode()"
            />
          </div>
        </div>
      </div>

      <div class="card">
        <h5>Breadcrumbs</h5>
        <p>Breadcrumbs are automatically generated from route data. Navigate to a sub-page to see them in the topbar.</p>
        <div class="flex gap-2 flex-wrap">
          <a routerLink="/uikit/button" pButton label="Button Demo" class="p-button-outlined"></a>
          <a routerLink="/uikit/table" pButton label="Table Demo" class="p-button-outlined"></a>
          <a routerLink="/pages/documentation" pButton label="Documentation" class="p-button-outlined"></a>
          <a routerLink="/hierarchy/submenu_1" pButton label="Hierarchy" class="p-button-outlined"></a>
        </div>
      </div>
    </div>
  `,
})
export class TopbarDemo {
  protected store = inject(LayoutStore);
}
