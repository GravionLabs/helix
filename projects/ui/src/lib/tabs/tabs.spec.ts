import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTab, HxTabContent, HxTabList, HxTabPanel, HxTabPanels, HxTabs } from './tabs';

@Component({
  selector: 'app-probe',
  template: 'probe',
})
class Probe {
  static created = 0;
  constructor() {
    Probe.created++;
  }
}

@Component({
  imports: [HxTabs, HxTabList, HxTab, HxTabPanels, HxTabPanel, HxTabContent, Probe],
  template: `
    <hx-tabs id="t" [(value)]="tab">
      <hx-tab-list>
        <hx-tab value="a">Profile</hx-tab>
        <hx-tab value="b">Billing</hx-tab>
        <hx-tab value="c" disabled>Soon</hx-tab>
        <hx-tab value="d">Team</hx-tab>
      </hx-tab-list>
      <hx-tab-panels>
        <hx-tab-panel value="a">Profile content</hx-tab-panel>
        <hx-tab-panel value="b"><ng-template hxTabContent><app-probe /></ng-template></hx-tab-panel>
        <hx-tab-panel value="c">Soon content</hx-tab-panel>
        <hx-tab-panel value="d">Team content</hx-tab-panel>
      </hx-tab-panels>
    </hx-tabs>
    <hx-tabs id="alive" keepAlive [(value)]="aliveTab">
      <hx-tab-list><hx-tab value="x">X</hx-tab><hx-tab value="y">Y</hx-tab></hx-tab-list>
      <hx-tab-panels>
        <hx-tab-panel value="x"><ng-template hxTabContent>X body</ng-template></hx-tab-panel>
        <hx-tab-panel value="y"><ng-template hxTabContent>Y body</ng-template></hx-tab-panel>
      </hx-tab-panels>
    </hx-tabs>
    <hx-tabs id="def"><hx-tab-list><hx-tab value="p" disabled>P</hx-tab><hx-tab value="q">Q</hx-tab></hx-tab-list><hx-tab-panels><hx-tab-panel value="p">P</hx-tab-panel><hx-tab-panel value="q">Q</hx-tab-panel></hx-tab-panels></hx-tabs>
  `,
})
class Host {
  tab = signal<string | null>('a');
  aliveTab = signal<string | null>('x');
}

describe('HxTabs', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const tabs = (id: string) => [...el(id).querySelectorAll<HTMLElement>('[role=tab]')];
  const panels = (id: string) => [...el(id).querySelectorAll<HTMLElement>('[role=tabpanel]')];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const press = (key: string) =>
    (document.activeElement as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true }),
    );

  beforeEach(async () => {
    Probe.created = 0;
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('has a tablist of tabs and a tabpanel per tab, linked both ways', () => {
    expect(el('t').querySelector('[role=tablist]')).toBeTruthy();
    const [a] = tabs('t');
    const [pa] = panels('t');
    expect(a.getAttribute('aria-controls')).toBe(pa.id);
    expect(pa.getAttribute('aria-labelledby')).toBe(a.id);
  });

  it('marks the active tab selected, with a roving tabindex, and shows only its panel', () => {
    expect(tabs('t').map((t) => t.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
      'false',
    ]);
    expect(tabs('t').map((t) => t.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(panels('t').map((p) => p.hidden)).toEqual([false, true, true, true]);
  });

  it('activates a tab by click and writes the value; a disabled tab does nothing', async () => {
    tabs('t')[1].click();
    await settle();
    expect(host.tab()).toBe('b');
    expect(panels('t').map((p) => p.hidden)).toEqual([true, false, true, true]);
    expect(tabs('t')[2].getAttribute('aria-disabled')).toBe('true');
    tabs('t')[2].click();
    await settle();
    expect(host.tab()).toBe('b');
  });

  it('moves with Left, Right, Home and End, skips disabled tabs and activates automatically', async () => {
    tabs('t')[0].focus();
    press('ArrowRight');
    await settle();
    expect(document.activeElement).toBe(tabs('t')[1]);
    expect(host.tab()).toBe('b');
    press('ArrowRight');
    await settle();
    expect(document.activeElement).toBe(tabs('t')[3]);
    expect(host.tab()).toBe('d');
    press('ArrowRight');
    await settle();
    expect(host.tab()).toBe('a');
    press('ArrowLeft');
    await settle();
    expect(host.tab()).toBe('d');
    press('Home');
    await settle();
    expect(host.tab()).toBe('a');
    press('End');
    await settle();
    expect(host.tab()).toBe('d');
  });

  it('activates with Enter and Space on a focused tab', async () => {
    tabs('t')[1].focus();
    tabs('t')[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await settle();
    expect(host.tab()).toBe('b');
    host.tab.set('a');
    await settle();
    tabs('t')[3].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await settle();
    expect(host.tab()).toBe('d');
  });

  it('creates lazy content when its tab first shows and destroys it again without keepAlive', async () => {
    expect(Probe.created).toBe(0);
    tabs('t')[1].click();
    await settle();
    expect(Probe.created).toBe(1);
    expect(el('t').querySelector('app-probe')).toBeTruthy();
    tabs('t')[0].click();
    await settle();
    expect(el('t').querySelector('app-probe')).toBeNull();
  });

  it('keeps visited lazy content with keepAlive', async () => {
    expect(panels('alive')[0].textContent).toContain('X body');
    expect(panels('alive')[1].textContent).not.toContain('Y body');
    tabs('alive')[1].click();
    await settle();
    expect(panels('alive')[1].textContent).toContain('Y body');
    expect(panels('alive')[0].textContent).toContain('X body');
    expect(panels('alive')[0].hidden).toBe(true);
  });

  it('starts on the first enabled tab when no value is set', async () => {
    await settle();
    expect(tabs('def').map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true']);
  });
});
