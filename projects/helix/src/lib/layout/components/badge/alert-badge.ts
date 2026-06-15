import { Component, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface AlertItem {
  id: string;
  label: string;
  severity: string;
  route?: string;
}

@Component({
  selector: 'helix-alert-badge',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="helix-alert-badge">
      <button
        type="button"
        class="layout-topbar-action"
        (click)="open.set(!open())"
        (blur)="open.set(false)"
      >
        <i class="pi pi-bell"></i>
        @if (count() > 0) {
          <span class="helix-alert-badge__count">{{ count() }}</span>
        }
      </button>
      @if (open() && alerts() && alerts()!.length > 0) {
        <div class="helix-alert-badge__dropdown">
          @for (alert of alerts(); track alert.id) {
            <a
              class="helix-alert-badge__item"
              [class.helix-alert-badge__item--warn]="alert.severity === 'warn'"
              [class.helix-alert-badge__item--error]="alert.severity === 'error'"
              [class.helix-alert-badge__item--success]="alert.severity === 'success'"
              [routerLink]="alert.route || undefined"
            >
              <span class="helix-alert-badge__dot"></span>
              <span class="helix-alert-badge__label">{{ alert.label }}</span>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .helix-alert-badge {
        position: relative;
        display: inline-flex;
      }
      .helix-alert-badge__count {
        position: absolute;
        top: -0.25rem;
        right: -0.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1rem;
        height: 1rem;
        padding: 0 0.25rem;
        border-radius: 9999px;
        background-color: var(--p-red-500, #ef4444);
        color: white;
        font-size: 0.625rem;
        font-weight: 700;
        line-height: 1;
      }
      .helix-alert-badge__dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        min-width: 16rem;
        background-color: var(--surface-overlay, white);
        border: 1px solid var(--surface-border, #e5e7eb);
        border-radius: var(--content-border-radius, 6px);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 1000;
        padding: 0.5rem;
      }
      .helix-alert-badge__item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: var(--content-border-radius, 6px);
        text-decoration: none;
        color: var(--text-color, #1f2937);
        cursor: pointer;
      }
      .helix-alert-badge__item:hover {
        background-color: var(--surface-hover, #f3f4f6);
      }
      .helix-alert-badge__dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: var(--p-info-500, #3b82f6);
        flex-shrink: 0;
      }
      .helix-alert-badge__item--warn .helix-alert-badge__dot {
        background-color: var(--p-warn-500, #f59e0b);
      }
      .helix-alert-badge__item--error .helix-alert-badge__dot {
        background-color: var(--p-red-500, #ef4444);
      }
      .helix-alert-badge__item--success .helix-alert-badge__dot {
        background-color: var(--p-green-500, #22c55e);
      }
      .helix-alert-badge__label {
        font-size: 0.875rem;
      }
    `,
  ],
})
export class HelixAlertBadge {
  count = input.required<number>();
  alerts = input<AlertItem[]>();
  protected open = signal(false);
}
