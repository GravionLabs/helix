import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxMessage, type HxMessageSeverity } from './message';

@Component({
  imports: [HxMessage],
  template: `
    <hx-message id="m" [severity]="severity()" [variant]="variant()" closable (close)="closed = closed + 1">Saved <b>now</b></hx-message>
    <hx-message id="err" severity="error">Failed</hx-message>
    <hx-message id="life" [life]="50" (close)="lifeClosed = lifeClosed + 1">Soon gone</hx-message>
    <hx-message id="icon" icon="pi pi-star" size="small">Custom</hx-message>
  `,
})
class Host {
  severity = signal<HxMessageSeverity>('success');
  variant = signal<'filled' | 'outlined' | 'simple'>('filled');
  closed = 0;
  lifeClosed = 0;
}

describe('HxMessage', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('shows the projected text with an icon, as a status', () => {
    expect(el('m').getAttribute('role')).toBe('status');
    expect(el('m').querySelector('.hx-message-text')?.textContent?.trim()).toBe('Saved now');
    expect(el('m').querySelector('.hx-message-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('is an alert for errors', () => {
    expect(el('err').getAttribute('role')).toBe('alert');
  });

  it('maps severity, variant and size to classes', async () => {
    expect(el('m').classList).toContain('hx-message-success');
    host.severity.set('warn');
    host.variant.set('outlined');
    await settle();
    expect(el('m').classList).toContain('hx-message-warn');
    expect(el('m').classList).toContain('hx-message-outlined');
    expect(el('m').classList).not.toContain('hx-message-success');
    expect(el('icon').classList).toContain('hx-message-sm');
  });

  it('uses custom icon classes instead of the built-in icon', () => {
    expect(el('icon').querySelector('i.pi-star')).toBeTruthy();
    expect(el('icon').querySelector('.hx-message-icon')).toBeNull();
  });

  it('closes with a labelled button and emits close', async () => {
    const button = el('m').querySelector('.hx-message-close') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Close');
    expect(el('err').querySelector('.hx-message-close')).toBeNull();
    button.click();
    await settle();
    expect(host.closed).toBe(1);
    expect(el('m').hasAttribute('hidden')).toBe(true);
  });

  it('hides itself after life milliseconds and emits close', async () => {
    expect(el('life').hasAttribute('hidden')).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 90));
    await settle();
    expect(host.lifeClosed).toBe(1);
    expect(el('life').hasAttribute('hidden')).toBe(true);
  });
});
