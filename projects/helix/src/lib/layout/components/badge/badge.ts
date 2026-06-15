import { Component, computed, input } from '@angular/core';

export type BadgeSeverity = 'info' | 'warn' | 'error' | 'success';

@Component({
  selector: 'helix-badge',
  standalone: true,
  template: `
    <span
      class="helix-badge"
      [class.helix-badge--sm]="size() === 'sm'"
      [class.helix-badge--info]="severity() === 'info'"
      [class.helix-badge--warn]="severity() === 'warn'"
      [class.helix-badge--error]="severity() === 'error'"
      [class.helix-badge--success]="severity() === 'success'"
    >
      @if (icon(); as icn) {
        <i [class]="icn"></i>
      }
      @if (label(); as lbl) {
        <span class="helix-badge__label">{{ lbl }}</span>
      }
    </span>
  `,
  styles: [
    `
      .helix-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
      }
      .helix-badge--sm {
        padding: 0.125rem 0.375rem;
        font-size: 0.625rem;
      }
      .helix-badge--info {
        background-color: var(--badge-bg, var(--p-info-100, #e0f2fe));
        color: var(--badge-color, var(--p-info-700, #0369a1));
      }
      .helix-badge--warn {
        background-color: var(--badge-bg, var(--p-warn-100, #fef3c7));
        color: var(--badge-color, var(--p-warn-700, #b45309));
      }
      .helix-badge--error {
        background-color: var(--badge-bg, var(--p-error-100, #fce4ec));
        color: var(--badge-color, var(--p-error-700, #c62828));
      }
      .helix-badge--success {
        background-color: var(--badge-bg, var(--p-success-100, #dcfce7));
        color: var(--badge-color, var(--p-success-700, #15803d));
      }
    `,
  ],
})
export class HelixBadge {
  severity = input.required<BadgeSeverity>();
  label = input<string>();
  icon = input<string>();
  size = input<'sm' | 'md'>('md');
}
