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
    <button type="button" class="alert-badge-trigger" (click)="open.set(!open())" (blur)="open.set(false)">
      <i class="pi pi-bell"></i>
      @if (count() > 0) {
        <span class="alert-badge-count">{{ count() }}</span>
      }
    </button>
    @if (open() && alerts() && alerts()!.length > 0) {
      <div class="alert-badge-dropdown">
        @for (alert of alerts(); track alert.id) {
          <a
            class="alert-badge-item"
            [class.alert-badge-item--warn]="alert.severity === 'warn'"
            [class.alert-badge-item--error]="alert.severity === 'error'"
            [class.alert-badge-item--success]="alert.severity === 'success'"
            [routerLink]="alert.route || undefined"
          >
            <span class="alert-badge-dot"></span>
            <span class="alert-badge-label">{{ alert.label }}</span>
          </a>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        color: var(--text-color);
        cursor: pointer;
      }
      :host:hover {
        background-color: var(--surface-hover);
      }
      .alert-badge-trigger {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        width: 100%;
        height: 100%;
        position: relative;
      }
      .alert-badge-trigger i {
        font-size: 1.4rem;
      }
      .alert-badge-count {
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
      .alert-badge-dropdown {
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
      .alert-badge-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: var(--content-border-radius, 6px);
        text-decoration: none;
        color: var(--text-color, #1f2937);
        cursor: pointer;
      }
      .alert-badge-item:hover {
        background-color: var(--surface-hover, #f3f4f6);
      }
      .alert-badge-dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: var(--p-info-500, #3b82f6);
        flex-shrink: 0;
      }
      .alert-badge-item--warn .alert-badge-dot {
        background-color: var(--p-warn-500, #f59e0b);
      }
      .alert-badge-item--error .alert-badge-dot {
        background-color: var(--p-red-500, #ef4444);
      }
      .alert-badge-item--success .alert-badge-dot {
        background-color: var(--p-green-500, #22c55e);
      }
      .alert-badge-label {
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
