import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxMessageService } from './message-service';
import { HxToast } from './toast';

@Component({
  imports: [HxToast],
  template: `
    <hx-toast id="main" position="bottom-left" />
    <hx-toast id="keyed" key="form" />
  `,
})
class Host {}

describe('HxToast', () => {
  let fixture: ComponentFixture<Host>;
  let service: HxMessageService;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const items = (id: string) => [...el(id).querySelectorAll<HTMLElement>('.hx-toast-item')];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    service = TestBed.inject(HxMessageService);
    await settle();
  });

  afterEach(() => service.clear());

  it('shows a message with summary and detail, positioned by class', async () => {
    service.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'The order was saved.',
      life: 5000,
    });
    await settle();
    expect(el('main').classList).toContain('hx-toast-bottom-left');
    expect(items('main').length).toBe(1);
    expect(items('main')[0].classList).toContain('hx-toast-success');
    expect(items('main')[0].querySelector('.hx-toast-summary')?.textContent).toBe('Saved');
    expect(items('main')[0].querySelector('.hx-toast-detail')?.textContent).toBe(
      'The order was saved.',
    );
  });

  it('is a polite live region for info and success, assertive for warn and error', async () => {
    for (const severity of ['info', 'success', 'warn', 'error'] as const)
      service.add({ severity, summary: severity, sticky: true });
    await settle();
    expect(items('main').map((i) => [i.getAttribute('role'), i.getAttribute('aria-live')])).toEqual(
      [
        ['status', 'polite'],
        ['status', 'polite'],
        ['alert', 'assertive'],
        ['alert', 'assertive'],
      ],
    );
  });

  it('closes with a labelled button', async () => {
    service.add({ summary: 'Hello', sticky: true });
    await settle();
    const close = items('main')[0].querySelector('.hx-toast-close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Close');
    close.click();
    await settle();
    expect(items('main').length).toBe(0);
    service.add({ summary: 'No button', sticky: true, closable: false });
    await settle();
    expect(items('main')[0].querySelector('.hx-toast-close')).toBeNull();
  });

  it('removes a message after its life', async () => {
    service.add({ summary: 'Short', life: 40 });
    await settle();
    expect(items('main').length).toBe(1);
    await new Promise((resolve) => setTimeout(resolve, 80));
    await settle();
    expect(items('main').length).toBe(0);
  });

  it('keeps a sticky message', async () => {
    service.add({ summary: 'Sticky', sticky: true, life: 10 });
    await new Promise((resolve) => setTimeout(resolve, 50));
    await settle();
    expect(items('main').length).toBe(1);
  });

  it('pauses while the pointer or the focus is on a message', async () => {
    service.add({ summary: 'Hover me', life: 60 });
    await settle();
    items('main')[0].dispatchEvent(new Event('mouseenter'));
    await new Promise((resolve) => setTimeout(resolve, 150));
    await settle();
    expect(items('main').length).toBe(1);
    items('main')[0].dispatchEvent(new Event('mouseleave'));
    await new Promise((resolve) => setTimeout(resolve, 650));
    await settle();
    expect(items('main').length).toBe(0);
  });

  it('shows keyed messages only in the toast with that key', async () => {
    service.add({ summary: 'General', sticky: true });
    service.add({ summary: 'Form', sticky: true, key: 'form' });
    await settle();
    expect(items('main').map((i) => i.querySelector('.hx-toast-summary')?.textContent)).toEqual([
      'General',
    ]);
    expect(items('keyed').map((i) => i.querySelector('.hx-toast-summary')?.textContent)).toEqual([
      'Form',
    ]);
    service.clear('form');
    await settle();
    expect(items('keyed').length).toBe(0);
    expect(items('main').length).toBe(1);
    service.clear();
    await settle();
    expect(items('main').length).toBe(0);
  });
});
