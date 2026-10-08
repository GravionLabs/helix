import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule, type Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HxButton, HxCheckbox, HxInput, HxSelect, HxSwitch } from '@gravionlabs/helix-ui';

interface Row {
  name: string;
  category: string;
  price: number;
}

const ROWS: Row[] = Array.from({ length: 23 }, (_, i) => ({
  name: `Product ${i + 1}`,
  category: ['Accessories', 'Clothing', 'Electronics', 'Fitness'][i % 4],
  price: Math.round((19 + i * 7.3) * 100) / 100,
}));

/** SPIKE: Angular Material themed with the Helix tokens, next to helix-ui. */
@Component({
  selector: 'app-spike-material',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    HxButton,
    HxCheckbox,
    HxInput,
    HxSelect,
    HxSwitch,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './spike-material.html',
  styleUrl: './spike-material.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpikeMaterial {
  readonly #dialog = inject(MatDialog);
  readonly dialogTpl = viewChild.required<TemplateRef<unknown>>('dialogTpl');

  readonly sizes = ['Small', 'Medium', 'Large'];
  size: string | null = 'Medium';
  text = '';
  agreed = true;
  on = false;
  date: Date | null = null;
  date2: Date | null = null;

  readonly columns = ['name', 'category', 'price'];
  readonly pageSize = signal(5);
  readonly pageIndex = signal(0);
  readonly sort = signal<Sort>({ active: '', direction: '' });

  rows(): Row[] {
    const { active, direction } = this.sort();
    const sorted = [...ROWS];
    if (active && direction) {
      const key = active as keyof Row;
      sorted.sort(
        (a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (direction === 'asc' ? 1 : -1),
      );
    }
    const start = this.pageIndex() * this.pageSize();
    return sorted.slice(start, start + this.pageSize());
  }

  readonly total = ROWS.length;

  onPage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openDialog() {
    this.#dialog.open(this.dialogTpl(), { width: '28rem' });
  }
}
