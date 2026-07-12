import type { AlertItem } from './actions/alert-action';

export interface HelixTopbarAction {
  icon: string;
  label: string;
  command?: () => void;
}

export type HelixTopbarItemType = 'darkmode' | 'configurator' | 'mobile' | 'alert' | 'action';

export interface HelixTopbarItem {
  type: HelixTopbarItemType;
  icon?: string;
  label?: string;
  badgeCount?: number;
  alerts?: AlertItem[];
  command?: () => void;
}
