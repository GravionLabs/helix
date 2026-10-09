import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { HxMenuItem } from '../menu-item';
import { HxSplitButton } from './split-button';

@Component({
  imports: [HxSplitButton],
  template: `
    <hx-split-button id="a" label="Save" icon="pi pi-save" severity="success" [model]="items" [disabled]="off()" (click)="clicks = clicks + 1" (triggered)="triggered = triggered + 1" />
    <hx-split-button id="b" label="Other" variant="outlined" size="small" menuButtonLabel="Options" [model]="items" />
  `,
})
class Host {
  clicks = 0;
  triggered = 0;
  log: string[] = [];
  off = signal(false);
  items: HxMenuItem[] = [
    { label: 'Draft', command: () => this.log.push('draft') },
    { label: 'Close', command: () => this.log.push('close') },
  ];
}

describe('HxSplitButton', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`) as HTMLElement;
  const main = (id: string) => el(id).querySelector('.hx-split-button-main') as HTMLButtonElement;
  const more = (id: string) => el(id).querySelector('.hx-split-button-menu') as HTMLButtonElement;
  const menuItems = () => [
    ...document.querySelectorAll<HTMLElement>('.cdk-overlay-container [role=menuitem]'),
  ];
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('is a group of two buttons named by the label, with the look of hx-button', () => {
    expect(el('a').getAttribute('role')).toBe('group');
    expect(el('a').getAttribute('aria-label')).toBe('Save');
    expect(main('a').textContent?.trim()).toBe('Save');
    expect(main('a').querySelector('.pi-save')).toBeTruthy();
    expect(main('a').classList).toContain('hx-button-success');
    expect(el('b').classList).toContain('hx-split-button-outlined');
    expect(main('b').classList).toContain('hx-button-sm');
  });

  it('names the menu button and marks it as opening a menu', () => {
    expect(more('a').getAttribute('aria-label')).toBe('More actions');
    expect(more('b').getAttribute('aria-label')).toBe('Options');
    expect(more('a').getAttribute('aria-haspopup')).toBe('menu');
    expect(more('a').getAttribute('aria-expanded')).toBe('false');
  });

  it('click on the main button reaches the host listener; the menu button does not', async () => {
    main('a').click();
    expect(host.clicks).toBe(1);
    more('a').click();
    await settle();
    expect(host.clicks).toBe(1);
  });

  it('opens the menu from the menu button, runs a command, emits triggered and returns the focus', async () => {
    more('a').click();
    await settle();
    expect(more('a').getAttribute('aria-expanded')).toBe('true');
    expect(menuItems().map((i) => i.textContent?.trim())).toEqual(['Draft', 'Close']);
    menuItems()[1].click();
    await settle();
    expect(host.log).toEqual(['close']);
    expect(host.triggered).toBe(1);
    expect(more('a').getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(more('a'));
  });

  it('disables both buttons', async () => {
    host.off.set(true);
    await settle();
    expect(main('a').disabled).toBe(true);
    expect(more('a').disabled).toBe(true);
  });
});
