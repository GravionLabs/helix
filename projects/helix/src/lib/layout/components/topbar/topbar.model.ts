import type { AlertItem } from '../badge/alert-badge';

export interface HelixTopbarAction {
  icon: string;
  label: string;
  command?: () => void;
}

export type HelixTopbarBadgeType = 'darkmode' | 'configurator' | 'mobile' | 'alert' | 'action';

export interface HelixTopbarBadge {
  type: HelixTopbarBadgeType;
  icon?: string;
  label?: string;
  badgeCount?: number;
  alerts?: AlertItem[];
  command?: () => void;
}
