import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxChip } from './chip';

@Component({
  imports: [HxChip],
  template: `
    <hx-chip id="plain" label="Plain" icon="pi pi-user" />
    <hx-chip id="image" label="Amy" image="/amy.png" icon="pi pi-user" />
    <hx-chip id="removable" label="Angular" removable removeLabel="Remove Angular" (remove)="removed = removed + 1" />
    <hx-chip id="content" removable>Projected</hx-chip>
  `,
})
class Host {
  removed = 0;
}

describe('HxChip', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;
  const key = (id: string, k: string, target: HTMLElement = el(id)) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the label and an aria-hidden icon', () => {
    expect(el('plain').textContent?.trim()).toBe('Plain');
    expect(el('plain').querySelector('.hx-chip-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(el('plain').getAttribute('tabindex')).toBeNull();
    expect(el('plain').querySelector('button')).toBeNull();
  });

  it('prefers the image to the icon and treats it as decorative', () => {
    const img = el('image').querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/amy.png');
    expect(img.getAttribute('alt')).toBe('');
    expect(el('image').querySelector('.hx-chip-icon')).toBeNull();
  });

  it('a removable chip is a focusable group with a named remove button', () => {
    expect(el('removable').getAttribute('tabindex')).toBe('0');
    expect(el('removable').getAttribute('role')).toBe('group');
    expect(el('removable').getAttribute('aria-label')).toBe('Angular');
    const button = el('removable').querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Remove Angular');
    expect(el('content').querySelector('button')?.getAttribute('aria-label')).toBe('Remove');
  });

  it('emits remove from the button, Backspace and Delete', () => {
    (el('removable').querySelector('button') as HTMLElement).click();
    expect(host.removed).toBe(1);
    key('removable', 'Backspace');
    key('removable', 'Delete');
    expect(host.removed).toBe(3);
  });

  it('ignores the keys on a chip that is not removable, and does not remove twice from the button', () => {
    key('plain', 'Backspace');
    expect(host.removed).toBe(0);
    key('removable', 'Delete', el('removable').querySelector('button') as HTMLElement);
    expect(host.removed).toBe(0);
  });
});
