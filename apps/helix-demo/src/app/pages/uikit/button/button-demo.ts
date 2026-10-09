import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxButton,
  HxButtonGroup,
  type HxButtonSeverity,
  type HxMenuItem,
  HxSplitButton,
} from '@gravionlabs/helix-ui';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [HxButton, HxButtonGroup, HxSplitButton],
  templateUrl: './button-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './button-demo.scss',
})
export class ButtonDemo {
  readonly severities: HxButtonSeverity[] = [
    'primary',
    'secondary',
    'success',
    'info',
    'warn',
    'help',
    'danger',
    'contrast',
  ];
  readonly iconSeverities: { icon: string; severity: HxButtonSeverity }[] = [
    { icon: 'pi pi-check', severity: 'primary' },
    { icon: 'pi pi-bookmark', severity: 'secondary' },
    { icon: 'pi pi-search', severity: 'success' },
    { icon: 'pi pi-user', severity: 'info' },
    { icon: 'pi pi-bell', severity: 'warn' },
    { icon: 'pi pi-heart', severity: 'help' },
    { icon: 'pi pi-times', severity: 'danger' },
  ];

  readonly items: HxMenuItem[] = [
    { label: 'Update', icon: 'pi pi-refresh' },
    { label: 'Delete', icon: 'pi pi-times' },
    { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
    { separator: true },
    { label: 'Setup', icon: 'pi pi-cog' },
  ];

  readonly loading = signal([false, false, false, false]);

  load(index: number) {
    this.loading.update((l) => l.map((v, i) => (i === index ? true : v)));
    setTimeout(() => this.loading.update((l) => l.map((v, i) => (i === index ? false : v))), 1000);
  }
}
