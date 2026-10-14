import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { BadgeSeverity } from './badge';
import { HelixBadge } from './badge';

export type Environment = 'development' | 'testing' | 'staging' | 'production';

/** Custom environment with a free label and a badge severity. */
export interface CustomEnvironment {
  label: string;
  severity: BadgeSeverity;
}

export type EnvironmentValue = Environment | CustomEnvironment;

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
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <helix-badge
      [severity]="mapped().severity"
      [icon]="mapped().icon"
      [label]="mapped().label"
    />
  `,
})
export class HelixEnvironmentBadge {
  environment = input.required<EnvironmentValue>();

  protected mapped = computed(() => {
    const env = this.environment();
    if (typeof env === 'object' && env !== null) {
      return { severity: env.severity, icon: '', label: env.label };
    }
    return ENV_MAP[env] ?? DEFAULT_ENV;
  });
}
