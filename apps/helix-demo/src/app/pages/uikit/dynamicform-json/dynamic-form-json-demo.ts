import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TextareaModule } from '@gravionlabs/helix/textarea';
import { HelixDynamicForm } from '@gravionlabs/helix-zod';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { parseFormDefinition } from './json-form-definition';

/** Example definition, as it could come out of a database row. */
const STORED_DEFINITION = {
  title: 'Support ticket',
  submitLabel: 'Create ticket',
  fields: [
    { key: 'subject', type: 'text', label: 'Subject', required: true, minLength: 5 },
    {
      key: 'priority',
      type: 'select',
      label: 'Priority',
      options: ['low', 'normal', 'high'],
      default: 'normal',
    },
    { key: 'email', type: 'email', label: 'Contact e-mail', required: true },
    {
      key: 'affectedUsers',
      type: 'number',
      label: 'Affected users',
      min: 1,
      hint: 'Leave empty if unknown',
    },
    { key: 'description', type: 'textarea', label: 'Description', required: true, minLength: 20 },
    { key: 'dueDate', type: 'date', label: 'Needed by' },
    { key: 'confirmed', type: 'checkbox', label: 'I checked the FAQ first', required: true },
  ],
};

@Component({
  selector: 'app-dynamic-form-json-demo',
  standalone: true,
  imports: [HelixDynamicForm, JsonPipe, TextareaModule, SourceTabsComponent],
  templateUrl: './dynamic-form-json-demo.html',
  styleUrl: './dynamic-form-json-demo.scss',
})
export class DynamicFormJsonDemo {
  protected readonly definitionJson = signal(JSON.stringify(STORED_DEFINITION, null, 2));

  /** Re-parses the definition on every edit — errors render instead of the form. */
  protected readonly parsed = computed(() => parseFormDefinition(this.definitionJson()));

  protected readonly submittedValue = signal<unknown>(null);

  protected onSubmitted(value: unknown): void {
    this.submittedValue.set(value);
  }
}
