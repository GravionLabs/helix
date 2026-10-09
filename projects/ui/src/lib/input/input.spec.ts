import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HxInput, type HxInputSize, type HxInputVariant } from './input';

@Component({
  imports: [HxInput, FormsModule],
  template: `
    <input hx-input id="a" [variant]="variant()" [size]="size()" [fluid]="fluid()" [(ngModel)]="value" required />
    <textarea hx-input id="b" rows="3"></textarea>
    <textarea hx-input id="c" autoResize [ngModel]="text()"></textarea>
  `,
})
class Host {
  variant = signal<HxInputVariant>('outlined');
  size = signal<HxInputSize>('medium');
  fluid = signal(false);
  value = '';
  text = signal('one');
}

describe('HxInput', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let input: HTMLInputElement;
  let textarea: HTMLTextAreaElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    input = fixture.debugElement.query(By.css('#a')).nativeElement;
    textarea = fixture.debugElement.query(By.css('#b')).nativeElement;
  });

  const classes = (el: HTMLElement) => [...el.classList].filter((c) => c.startsWith('hx-'));

  it('is an outlined medium field by default, on an input and on a textarea', () => {
    expect(classes(input)).toEqual(['hx-input']);
    expect(classes(textarea)).toEqual(['hx-input']);
  });

  it.each([
    ['variant', 'filled', 'hx-input-filled'],
    ['size', 'small', 'hx-input-sm'],
    ['size', 'large', 'hx-input-lg'],
  ] as const)('%s="%s" adds %s', async (name, value, cls) => {
    (host[name] as { set(v: string): void }).set(value);
    await fixture.whenStable();
    expect(classes(input)).toEqual(['hx-input', cls]);
  });

  it('fluid adds hx-input-fluid', async () => {
    host.fluid.set(true);
    await fixture.whenStable();
    expect(classes(input)).toContain('hx-input-fluid');
  });

  it('stays a native control: ngModel writes the value, the invalid state is the one of Angular', async () => {
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.value).toBe('Ada');
    expect(input.classList).toContain('ng-valid');

    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    // the stylesheet styles `.hx-input.ng-invalid.ng-touched`
    expect(input.classList).toContain('ng-invalid');
    expect(input.classList).toContain('ng-touched');
  });

  it('keeps disabled and readonly native', () => {
    input.disabled = true;
    expect(input.matches(':disabled')).toBe(true);
  });

  describe('autoResize', () => {
    let auto: HTMLTextAreaElement;
    beforeEach(() => {
      auto = fixture.debugElement.query(By.css('#c')).nativeElement;
      // jsdom has no layout: derive the content height from the lines
      Object.defineProperty(auto, 'scrollHeight', {
        get: () => auto.value.split('\n').length * 20,
      });
    });

    it('sets the class and leaves other textareas alone', () => {
      expect(auto.classList).toContain('hx-input-auto-resize');
      expect(textarea.classList).not.toContain('hx-input-auto-resize');
      expect(textarea.style.height).toBe('');
    });

    it('follows the content on input, growing and shrinking', () => {
      auto.value = 'a\nb\nc';
      auto.dispatchEvent(new Event('input'));
      expect(auto.style.height).toBe('60px');
      auto.value = 'a';
      auto.dispatchEvent(new Event('input'));
      expect(auto.style.height).toBe('20px');
    });

    it('follows a value a form writes', async () => {
      host.text.set('x\ny\nz\nw');
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve));
      expect(auto.style.height).toBe('80px');
    });
  });
});
