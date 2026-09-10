import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface AlertItem {
  id: string;
  label: string;
  severity: string;
  route?: string;
}

@Component({
  selector: 'helix-alert-action',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './alert-action.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alert-action.scss',
})
export class HelixAlertAction {
  count = input.required<number>();
  alerts = input<AlertItem[]>();
  protected open = signal(false);
}
