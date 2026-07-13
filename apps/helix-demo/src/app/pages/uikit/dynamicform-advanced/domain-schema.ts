import { helixMeta } from '@gravionlabs/helix-zod';
import { z } from 'zod';

/**
 * A pristine domain schema, as it would live in a shared package next to the
 * API client — no UI concerns, usable for parsing anywhere.
 */
export const TaskSchema = z.object({
  name: z.string().min(2, 'At least 2 characters').default(''),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  dueDate: z.date().nullable().default(null),
  notifyAssignee: z.boolean().default(false),
});

export type Task = z.infer<typeof TaskSchema>;

// The form layer decorates the existing schema after the fact: `helixMeta`
// registers on the exact field instance composed into the shape (no clone),
// so the domain schema stays untouched and the root model type comes from
// `z.infer` instead of a hand-written interface.
helixMeta(TaskSchema.shape.name, { label: 'Task name', order: 1 });
helixMeta(TaskSchema.shape.priority, { label: 'Priority', order: 2 });
helixMeta(TaskSchema.shape.dueDate, {
  label: 'Due date',
  hint: 'Required for high-priority tasks',
  order: 3,
  requiredWhen: (root: Task) => root.priority === 'high',
});
helixMeta(TaskSchema.shape.notifyAssignee, {
  label: 'Notify assignee',
  order: 4,
  hiddenWhen: (root: Task) => root.priority === 'low',
});
