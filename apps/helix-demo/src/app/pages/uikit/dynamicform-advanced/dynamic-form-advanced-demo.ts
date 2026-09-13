import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { validate } from '@angular/forms/signals';
import { HelixDynamicForm, helixMeta } from '@gravionlabs/helix-zod';
import { z } from 'zod';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { TaskSchema } from './domain-schema';

interface ReviewRoot {
  status?: 'draft' | 'submitted' | 'archived';
  escalate?: boolean;
  [key: string]: unknown;
}

const ProjectReviewSchema = z.object({
  title: helixMeta(z.string().min(3, 'At least 3 characters').default('Untitled review'), {
    label: 'Title',
    order: 1,
    readonlyWhen: (root: ReviewRoot) => root.status !== 'draft',
  }),
  status: helixMeta(z.enum(['draft', 'submitted', 'archived']).default('draft'), {
    label: 'Status',
    hint: 'Anything but "draft" locks the title; "archived" freezes the score',
    order: 2,
  }),
  score: helixMeta(
    z.number().min(1, 'Please rate at least 1 star').max(5).nullable().default(null),
    {
      label: 'Overall score',
      widget: 'rating',
      stars: 5,
      order: 3,
      disabledWhen: (root: ReviewRoot) =>
        root.status === 'archived' ? 'Archived reviews are frozen' : false,
    },
  ),
  escalate: helixMeta(z.boolean().default(false), {
    label: 'Escalate to management',
    order: 4,
  }),
  escalationReason: helixMeta(z.string().default(''), {
    label: 'Escalation reason',
    widget: 'textarea',
    order: 5,
    hiddenWhen: (root: ReviewRoot) => !root.escalate,
    requiredWhen: (root: ReviewRoot) => !!root.escalate,
  }),
  reviewerEmail: helixMeta(z.email('Invalid e-mail').default(''), {
    label: 'Reviewer e-mail',
    placeholder: 'you@example.com',
    order: 6,
    extraSchema: (path) =>
      validate(path, ({ value }) =>
        typeof value() === 'string' && (value() as string).endsWith('@example.com')
          ? null
          : { kind: 'domain', message: 'Reviewers must use an @example.com address' },
      ),
  }),
});

@Component({
  selector: 'app-dynamic-form-advanced-demo',
  standalone: true,
  imports: [HelixDynamicForm, JsonPipe, SourceTabsComponent],
  templateUrl: './dynamic-form-advanced-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dynamic-form-advanced-demo.scss',
})
export class DynamicFormAdvancedDemo {
  // No `model` input is passed to the form — the initial value is derived
  // from the schema's `.default(...)` calls via `buildDefaultValue`.
  protected readonly schema = ProjectReviewSchema;

  protected readonly submittedValue = signal<unknown>(null);

  protected onSubmitted(value: unknown): void {
    this.submittedValue.set(value);
  }

  // Pattern B: a plain domain schema decorated with UI meta after the fact
  // (see domain-schema.ts) — no meta inline, root typed via `z.infer`.
  protected readonly taskSchema = TaskSchema;

  protected readonly taskSubmittedValue = signal<unknown>(null);

  protected onTaskSubmitted(value: unknown): void {
    this.taskSubmittedValue.set(value);
  }
}
