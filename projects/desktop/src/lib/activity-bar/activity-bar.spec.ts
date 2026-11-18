import { Component, computed, signal, type TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HxActivityBar, type HxActivityBarItem } from './activity-bar';

@Component({
  imports: [HxActivityBar],
  template: `
    <hx-activity-bar
      [items]="items"
      [activeId]="activeId()"
      [expanded]="expanded()"
      (selected)="picked.push($event)"
    />
  `,
})
class Host {
  readonly activeId = signal<string | null>('files');
  readonly expanded = signal(true);
  readonly picked: string[] = [];
  items: HxActivityBarItem[] = [
    { id: 'files', label: 'Files', icon: 'pi pi-folder', position: 'top' },
    { id: 'search', label: 'Search', icon: 'pi pi-search', position: 'top', badge: 3 },
    { id: 'sync', label: 'Sync', icon: 'pi pi-sync', position: 'top', kind: 'action', badge: true },
    { id: 'settings', label: 'Settings', icon: 'pi pi-cog', position: 'bottom' },
  ];
}

@Component({
  imports: [HxActivityBar],
  template: `
    <ng-template #svg><svg id="glyph" width="16" height="16"></svg></ng-template>
    <hx-activity-bar [items]="items()" />
  `,
})
class TemplateHost {
  readonly svg = viewChild.required<TemplateRef<unknown>>('svg');
  readonly items = computed<HxActivityBarItem[]>(() => [
    { id: 'a', label: 'A', icon: this.svg(), position: 'top' },
    { id: 'b', label: 'B', icon: 'pi pi-cog', position: 'top' },
  ]);
}

describe('HxActivityBar', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const button = (id: string) => root.querySelector(`[data-id="${id}"]`) as HTMLButtonElement;
    return { fixture, root, button, host: fixture.componentInstance };
  };

  it('emits the id on click for views and actions', () => {
    const { button, host } = setup();
    button('search').click();
    button('sync').click();
    expect(host.picked).toEqual(['search', 'sync']);
  });

  it('marks the active view with aria-pressed while expanded', () => {
    const { fixture, button, host } = setup();
    expect(button('files').getAttribute('aria-pressed')).toBe('true');
    expect(button('search').getAttribute('aria-pressed')).toBe('false');
    host.activeId.set('search');
    fixture.detectChanges();
    expect(button('search').getAttribute('aria-pressed')).toBe('true');
    expect(button('files').getAttribute('aria-pressed')).toBe('false');
  });

  it('does not mark the active view while collapsed', () => {
    const { fixture, button, host } = setup();
    host.expanded.set(false);
    fixture.detectChanges();
    expect(button('files').getAttribute('aria-pressed')).toBe('false');
    expect(button('files').classList).not.toContain('hx-activity-bar-active');
  });

  it('renders an action as a plain button without aria-pressed', () => {
    const { button } = setup();
    expect(button('sync').hasAttribute('aria-pressed')).toBe(false);
  });

  it('gives every item a tooltip and an aria-label', () => {
    const { button } = setup();
    for (const [id, label] of [
      ['files', 'Files'],
      ['settings', 'Settings'],
    ]) {
      expect(button(id).getAttribute('aria-label')).toBe(label);
      expect(button(id).getAttribute('title')).toBe(label);
    }
  });

  it('shows a count badge and a dot badge', () => {
    const { button } = setup();
    expect(button('search').querySelector('.hx-activity-bar-badge')?.textContent?.trim()).toBe('3');
    expect(button('sync').querySelector('.hx-activity-bar-badge-dot')).not.toBeNull();
    expect(button('files').querySelector('.hx-activity-bar-badge')).toBeNull();
  });

  it('puts bottom items in the bottom group', () => {
    const { root } = setup();
    const bottom = root.querySelector('.hx-activity-bar-bottom') as HTMLElement;
    expect(bottom.querySelector('[data-id="settings"]')).not.toBeNull();
  });

  it('is one tab stop: only the active item has tabindex 0', () => {
    const { fixture, root, button, host } = setup();
    const stops = () => Array.from(root.querySelectorAll('button')).filter((b) => b.tabIndex === 0);
    expect(stops()).toEqual([button('files')]);
    host.expanded.set(false);
    fixture.detectChanges();
    expect(stops()).toEqual([button('files')]);
    host.activeId.set(null);
    fixture.detectChanges();
    expect(stops().length).toBe(1);
  });

  it('moves focus with the arrow keys, wrapping, Home and End', () => {
    const { root, button } = setup();
    document.body.appendChild(root);
    const bar = root.querySelector('hx-activity-bar') as HTMLElement;
    const press = (key: string) =>
      bar.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    button('files').focus();
    press('ArrowDown');
    expect(document.activeElement).toBe(button('search'));
    press('ArrowUp');
    press('ArrowUp');
    expect(document.activeElement).toBe(button('settings'));
    press('ArrowDown');
    expect(document.activeElement).toBe(button('files'));
    press('End');
    expect(document.activeElement).toBe(button('settings'));
    press('Home');
    expect(document.activeElement).toBe(button('files'));
    root.remove();
  });

  it('draws a template icon and a named icon', () => {
    const fixture = TestBed.createComponent(TemplateHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-id="a"] svg#glyph')).not.toBeNull();
    expect(root.querySelector('[data-id="b"] .pi-cog')).not.toBeNull();
  });
});
