import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { z } from 'zod';
import { HelixDynamicForm } from '../../components/dynamic-form/dynamic-form';
import { helixMeta } from '../../model/helix-field-meta';
import { provideHelixDynamicForms } from '../../registry/provide-helix-dynamic-forms';

@Component({
  standalone: true,
  imports: [HelixDynamicForm],
  template: `<helix-dynamic-form [schema]="schema" [model]="model" [showSubmit]="false" />`,
})
class Host {
  readonly schema = z.object({
    born: helixMeta(z.date().nullable(), { label: 'Born' }),
  });
  readonly model = signal<Record<string, unknown>>({ born: new Date(2024, 4, 1) });
}

describe('HelixDateWidget', () => {
  let fixture: ComponentFixture<Host>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideHelixDynamicForms()],
    });
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    input = fixture.nativeElement.querySelector('input[type="date"]');
  });

  it('formats the model Date into the input', () => {
    expect(input.value).toBe('2024-05-01');
  });

  it('parses the input string into a Date in the model', () => {
    input.value = '2023-01-15';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const born = fixture.componentInstance.model()['born'] as Date;
    expect(born).toBeInstanceOf(Date);
    expect(born.getFullYear()).toBe(2023);
    expect(born.getMonth()).toBe(0);
    expect(born.getDate()).toBe(15);
  });

  it('maps an empty input to null', () => {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.model()['born']).toBeNull();
  });
});
