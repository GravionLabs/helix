import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HxAppShell, type HxSidebarState } from './app-shell';
import { HxAppToolbar } from './app-toolbar';

@Component({
  imports: [HxAppShell, HxAppToolbar],
  template: `
    <hx-app-shell
      #shell
      [(sidebarWidth)]="width"
      [(collapsed)]="collapsed"
      [(activeId)]="activeId"
      [(bottomHeight)]="bottomHeight"
      [(bottomOpen)]="bottomOpen"
      (sidebarChange)="changes.push($event)"
    >
      <hx-app-toolbar slot="toolbar"><span slot="centre">Title</span></hx-app-toolbar>
      <button slot="activity" id="files" (click)="shell.selectView('files')">Files</button>
      <button slot="activity" id="search" (click)="shell.selectView('search')">Search</button>
      <button slot="activity" id="show-files" (click)="shell.showView('files')">Show</button>
      <button slot="activity" id="show-search" (click)="shell.showView('search')">Show</button>
      <nav slot="sidebar" id="sidebar">Sidebar</nav>
      <div id="content">Content</div>
      <aside slot="panel" id="panel">Panel</aside>
      <section slot="bottom" id="bottom">Bottom</section>
      <footer slot="status" id="status">Status</footer>
    </hx-app-shell>
  `,
})
class Host {
  readonly width = signal(260);
  readonly collapsed = signal(false);
  readonly activeId = signal<string | null>('files');
  readonly bottomHeight = signal(200);
  readonly bottomOpen = signal(false);
  readonly changes: HxSidebarState[] = [];
}

describe('HxAppShell', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const $ = <T extends HTMLElement>(s: string) => root.querySelector(s) as T;
    const sidebar = () => $('.hx-app-shell-sidebar');
    const separator = () => $('[role="separator"]');
    const press = (key: string, shiftKey = false) => {
      separator().dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
    };
    const click = (id: string) => {
      $(`#${id}`).click();
      fixture.detectChanges();
    };
    return { fixture, host: fixture.componentInstance, $, sidebar, separator, press, click };
  };

  it('projects every slot', () => {
    const { $ } = setup();
    expect($('hx-app-toolbar')).toBeTruthy();
    expect($('.hx-app-shell-sidebar #sidebar')).toBeTruthy();
    expect($('.hx-app-shell-content #content')).toBeTruthy();
    expect($('#panel')).toBeTruthy();
    expect($('#status')).toBeTruthy();
    expect($('#files')).toBeTruthy();
  });

  it('collapses when the active view is selected again', () => {
    const { host, sidebar, separator, click } = setup();
    click('files');
    expect(host.collapsed()).toBe(true);
    expect(sidebar().hidden).toBe(true);
    expect(separator()).toBeNull();
    expect(host.changes.at(-1)).toEqual({ width: 260, collapsed: true });
  });

  it('expands when another view is selected', () => {
    const { host, sidebar, click } = setup();
    click('files');
    click('search');
    expect(host.collapsed()).toBe(false);
    expect(host.activeId()).toBe('search');
    expect(sidebar().hidden).toBe(false);
  });

  it('expands when the active view is selected while collapsed', () => {
    const { host, click } = setup();
    click('files');
    click('files');
    expect(host.collapsed()).toBe(false);
    expect(host.activeId()).toBe('files');
  });

  it('shows the active view without collapsing the sidebar', () => {
    const { host, sidebar, click } = setup();
    click('show-files');
    click('show-files');
    expect(host.collapsed()).toBe(false);
    expect(host.activeId()).toBe('files');
    expect(sidebar().hidden).toBe(false);
  });

  it('shows another view and expands a collapsed sidebar, and reports it', () => {
    const { host, click } = setup();
    click('files');
    expect(host.collapsed()).toBe(true);
    click('show-search');
    expect(host.collapsed()).toBe(false);
    expect(host.activeId()).toBe('search');
    expect(host.changes.at(-1)).toEqual({ width: 260, collapsed: false });
  });

  it('exposes the separator with its range', () => {
    const { separator } = setup();
    expect(separator().getAttribute('aria-orientation')).toBe('vertical');
    expect(separator().getAttribute('aria-valuenow')).toBe('260');
    expect(separator().getAttribute('aria-valuemin')).toBe('160');
    expect(separator().getAttribute('aria-valuemax')).toBe('480');
    expect(separator().tabIndex).toBe(0);
  });

  it('resizes with the arrow keys and reports the width', () => {
    const { host, sidebar, press } = setup();
    press('ArrowRight');
    expect(host.width()).toBe(276);
    expect(sidebar().style.width).toBe('276px');
    press('ArrowLeft');
    press('ArrowLeft');
    expect(host.width()).toBe(244);
    press('ArrowRight', true);
    expect(host.width()).toBe(308);
    expect(host.changes.at(-1)).toEqual({ width: 308, collapsed: false });
  });

  it('clamps to min and max, and Home and End jump to them', () => {
    const { host, press } = setup();
    press('End');
    expect(host.width()).toBe(480);
    press('ArrowRight');
    expect(host.width()).toBe(480);
    press('Home');
    expect(host.width()).toBe(160);
    press('ArrowLeft');
    expect(host.width()).toBe(160);
  });

  it('resizes with the pointer', () => {
    const { host, separator, fixture } = setup();
    const el = separator();
    const ev = (type: string, clientX: number) =>
      new PointerEvent(type, { clientX, pointerId: 1, button: 0, bubbles: true, cancelable: true });
    el.dispatchEvent(ev('pointerdown', 300));
    el.dispatchEvent(ev('pointermove', 340));
    fixture.detectChanges();
    expect(host.width()).toBe(300);
    el.dispatchEvent(ev('pointermove', 2000));
    expect(host.width()).toBe(480);
    el.dispatchEvent(ev('pointerup', 2000));
    el.dispatchEvent(ev('pointermove', 100));
    expect(host.width()).toBe(480);
  });

  it('ignores other keys', () => {
    const { host, press } = setup();
    press('a');
    expect(host.width()).toBe(260);
  });
});

describe('HxAppShell bottom panel', () => {
  const setup = (open = true) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.bottomOpen.set(open);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const $ = <T extends HTMLElement>(s: string) => root.querySelector(s) as T;
    const bottom = () => $('.hx-app-shell-bottom');
    const splitter = () => $('.hx-app-shell-resizer-bottom');
    const press = (key: string, shiftKey = false) => {
      splitter().dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
    };
    return { fixture, host: fixture.componentInstance, $, bottom, splitter, press };
  };

  it('projects the slot below the content, next to the sidebar', () => {
    const { $ } = setup();
    expect($('.hx-app-shell-main #bottom')).toBeTruthy();
    expect($('.hx-app-shell-main .hx-app-shell-content #bottom')).toBeNull();
    expect($('.hx-app-shell-body > #files')).toBeTruthy();
    expect($('#files').closest('.hx-app-shell-main')).toBeNull();
  });

  it('hides the slot and the splitter when closed', () => {
    const { bottom, splitter, host, fixture } = setup(false);
    expect(bottom().hidden).toBe(true);
    expect(splitter()).toBeNull();
    host.bottomOpen.set(true);
    fixture.detectChanges();
    expect(bottom().hidden).toBe(false);
    expect(splitter()).not.toBeNull();
  });

  it('exposes a horizontal separator with its range', () => {
    const { splitter, bottom } = setup();
    expect(splitter().getAttribute('aria-orientation')).toBe('horizontal');
    expect(splitter().getAttribute('aria-valuenow')).toBe('200');
    expect(splitter().getAttribute('aria-valuemin')).toBe('80');
    expect(splitter().getAttribute('aria-valuemax')).toBe('480');
    expect(splitter().tabIndex).toBe(0);
    expect(bottom().style.height).toBe('200px');
  });

  it('resizes with the arrow keys, Home and End, within the range', () => {
    const { host, press } = setup();
    press('ArrowUp');
    expect(host.bottomHeight()).toBe(216);
    press('ArrowDown');
    press('ArrowDown');
    expect(host.bottomHeight()).toBe(184);
    press('ArrowUp', true);
    expect(host.bottomHeight()).toBe(248);
    press('End');
    expect(host.bottomHeight()).toBe(480);
    press('ArrowUp');
    expect(host.bottomHeight()).toBe(480);
    press('Home');
    expect(host.bottomHeight()).toBe(80);
    press('ArrowDown');
    expect(host.bottomHeight()).toBe(80);
    press('a');
    expect(host.bottomHeight()).toBe(80);
  });

  it('resizes with the pointer: dragging up grows the panel', () => {
    const { host, splitter, fixture } = setup();
    const el = splitter();
    const ev = (type: string, clientY: number) =>
      new PointerEvent(type, { clientY, pointerId: 1, button: 0, bubbles: true, cancelable: true });
    el.dispatchEvent(ev('pointerdown', 500));
    el.dispatchEvent(ev('pointermove', 460));
    fixture.detectChanges();
    expect(host.bottomHeight()).toBe(240);
    el.dispatchEvent(ev('pointermove', -2000));
    expect(host.bottomHeight()).toBe(480);
    el.dispatchEvent(ev('pointerup', -2000));
    el.dispatchEvent(ev('pointermove', 900));
    expect(host.bottomHeight()).toBe(480);
  });
});

describe('HxAppToolbar', () => {
  it('is a drag region with start, centre and end slots', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const bar = (fixture.nativeElement as HTMLElement).querySelector(
      'hx-app-toolbar',
    ) as HTMLElement;
    expect(bar.hasAttribute('data-tauri-drag-region')).toBe(true);
    expect(bar.querySelector('.hx-app-toolbar-centre')?.textContent).toContain('Title');
    expect(bar.classList).not.toContain('hx-app-toolbar-inset');
  });

  it('leaves room for the window buttons on request', () => {
    @Component({ imports: [HxAppToolbar], template: `<hx-app-toolbar windowButtonsInset />` })
    class InsetHost {}
    const fixture = TestBed.createComponent(InsetHost);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('hx-app-toolbar')?.classList,
    ).toContain('hx-app-toolbar-inset');
  });
});
