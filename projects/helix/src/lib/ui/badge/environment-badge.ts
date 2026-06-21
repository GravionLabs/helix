import { Component, computed, input } from '@angular/core';
import type { BadgeSeverity } from './badge';
import { HelixBadge } from './badge';

export type Environment = 'development' | 'testing' | 'staging' | 'production';

const ENV_MAP: Record<Environment, { severity: BadgeSeverity; icon: string; label: string }> = {
  development: { severity: 'success', icon: 'pi pi-code', label: 'Development' },
  testing: { severity: 'info', icon: 'pi pi-flask', label: 'Testing' },
  staging: { severity: 'warn', icon: 'pi pi-layers', label: 'Staging' },
  production: { severity: 'error', icon: 'pi pi-verified', label: 'Production' },
};

const DEFAULT_ENV = { severity: 'info' as BadgeSeverity, icon: 'pi pi-question', label: 'Unknown' };

@Component({
  selector: 'helix-environment-badge',
  standalone: true,
  imports: [HelixBadge],
  template: `
    <helix-badge
      [severity]="mapped().severity"
      [icon]="mapped().icon"
      [label]="mapped().label"
    />
  `,
})
export class HelixEnvironmentBadge {
  environment = input.required<Environment>();

  protected mapped = computed(() => ENV_MAP[this.environment()] ?? DEFAULT_ENV);
}
