import {
  ChangeDetectionStrategy,
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HelixSelectWidget } from '../widgets/select-widget/select-widget';
import { HelixTextWidget } from '../widgets/text-widget/text-widget';
import { HelixFieldWidgetResolver } from './field-registry';
import { provideHelixDynamicForms } from './provide-helix-dynamic-forms';

@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.Eager, template: '' })
class CustomSelectWidget {}

describe('HelixFieldWidgetResolver', () => {
  it('resolves built-in widgets after provideHelixDynamicForms()', () => {
    TestBed.configureTestingModule({ providers: [provideHelixDynamicForms()] });
    const resolver = TestBed.inject(HelixFieldWidgetResolver);

    expect(resolver.resolve('text')).toBe(HelixTextWidget);
    expect(resolver.resolve('email')).toBe(HelixTextWidget);
    expect(resolver.resolve('select')).toBe(HelixSelectWidget);
  });

  it('lets consumer registrations override built-ins for the same kind', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHelixDynamicForms({
          widgets: [{ widget: 'select', component: CustomSelectWidget }],
        }),
      ],
    });
    const resolver = TestBed.inject(HelixFieldWidgetResolver);

    expect(resolver.resolve('select')).toBe(CustomSelectWidget);
    expect(resolver.resolve('text')).toBe(HelixTextWidget);
  });

  it('resolves custom widget kinds', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHelixDynamicForms({
          widgets: [{ widget: 'rating', component: CustomSelectWidget }],
        }),
      ],
    });

    expect(TestBed.inject(HelixFieldWidgetResolver).resolve('rating')).toBe(CustomSelectWidget);
  });

  it('throws for unregistered widget kinds', () => {
    TestBed.configureTestingModule({ providers: [provideHelixDynamicForms()] });

    expect(() => TestBed.inject(HelixFieldWidgetResolver).resolve('nope')).toThrowError(
      /No widget registered for kind "nope"/,
    );
  });

  it('resolves registrations from a child environment injector (route-scoped providers)', () => {
    TestBed.configureTestingModule({});
    const child = createEnvironmentInjector(
      [
        provideHelixDynamicForms({
          widgets: [{ widget: 'rating', component: CustomSelectWidget }],
        }),
      ],
      TestBed.inject(EnvironmentInjector),
    );
    const resolver = child.get(HelixFieldWidgetResolver);

    expect(resolver.resolve('text')).toBe(HelixTextWidget);
    expect(resolver.resolve('rating')).toBe(CustomSelectWidget);
  });

  it('throws when no registrations are provided at all', () => {
    TestBed.configureTestingModule({});

    expect(() => TestBed.inject(HelixFieldWidgetResolver).resolve('text')).toThrowError(
      /No widget registered/,
    );
  });
});
