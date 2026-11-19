import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { DesktopOverviewDemo } from './desktop-overview-demo';

describe('DesktopOverviewDemo', () => {
  let fixture: ComponentFixture<DesktopOverviewDemo>;
  let root: HTMLElement;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const panes = () => [...root.querySelectorAll<HTMLButtonElement>('button.pane')];
  const pane = (space: string, label: string) =>
    panes().find(
      (b) =>
        b.closest('ul.spaces > li')?.querySelector('.space-name')?.textContent === space &&
        b.textContent?.includes(label),
    )!;
  const tabs = () => [...root.querySelectorAll<HTMLElement>('hx-tab-bar [role="tab"]')];
  const activity = (label: string) =>
    root.querySelector<HTMLButtonElement>(`hx-activity-bar button[aria-label^="${label}"]`)!;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighlightOptions({
          coreLibraryLoader: () => import('highlight.js/lib/core'),
          languages: { xml: () => import('highlight.js/lib/languages/xml') },
        }),
      ],
    });
    fixture = TestBed.createComponent(DesktopOverviewDemo);
    root = fixture.nativeElement as HTMLElement;
    await render();
  });

  it('renders the poimen layout on the desktop shell', () => {
    expect(root.querySelector('hx-app-shell hx-app-toolbar')).not.toBeNull();
    expect(root.querySelector('hx-app-shell hx-activity-bar')).not.toBeNull();
    expect(root.querySelector('hx-app-shell hx-status-bar')?.textContent).toContain('1 waiting');
    expect([...root.querySelectorAll('.space-name')].map((e) => e.textContent)).toEqual([
      'api-gateway',
      'web-app',
      'docs-site',
    ]);
    expect(root.querySelector('.empty')?.textContent).toContain('Pick a pane on the left.');
  });

  it('shows poimen in the status bar, not herdr', async () => {
    pane('web-app', 'claude').click();
    await render();
    const status = root.querySelector('hx-app-shell hx-status-bar')?.textContent ?? '';
    expect(status).toContain('poimen connected');
    expect(root.textContent?.toLowerCase()).not.toContain('herdr');
  });

  it('previews a pane on click and replaces the preview with the next one', async () => {
    pane('web-app', 'claude').click();
    await render();
    expect(tabs().length).toBe(1);
    expect(root.querySelector('.terminal')?.getAttribute('aria-label')).toBe('web-app / claude');

    pane('api-gateway', 'terminal').click();
    await render();
    expect(tabs().length).toBe(1);
    expect(root.querySelector('.terminal')?.getAttribute('aria-label')).toBe(
      'api-gateway / terminal',
    );
  });

  it('keeps a pinned pane when another one is previewed', async () => {
    pane('web-app', 'claude').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await render();
    pane('docs-site', 'claude').click();
    await render();
    expect(tabs().length).toBe(2);
  });

  it('closes a tab and shows the empty state again', async () => {
    pane('docs-site', 'claude').click();
    await render();
    root.querySelector<HTMLButtonElement>('button[aria-label="Close docs-site / claude"]')!.click();
    await render();
    expect(tabs().length).toBe(0);
    expect(root.querySelector('.empty')).not.toBeNull();
  });

  it('shows the waiting panes from the status bar and keeps them open on a second click', async () => {
    const waiting = () =>
      [...root.querySelectorAll<HTMLButtonElement>('hx-status-bar button')].find((b) =>
        b.textContent?.includes('waiting'),
      )!;
    waiting().click();
    await render();
    expect(root.querySelector('.side-head h3')?.textContent).toBe('Notifications');
    waiting().click();
    await render();
    expect(root.querySelector<HTMLElement>('.hx-app-shell-sidebar')?.hidden).toBe(false);
    expect(root.querySelector('.side-head h3')?.textContent).toBe('Notifications');
  });

  it('switches the sidebar view from the activity bar', async () => {
    activity('Notifications').click();
    await render();
    expect(root.querySelector('.side-head h3')?.textContent).toBe('Notifications');
    expect(root.querySelector('.notifications')?.textContent).toContain('web-app');

    activity('Explorer').click();
    await render();
    expect(root.querySelector('.side-head h3')?.textContent).toBe('Explorer');
  });

  it('opens the settings as a tab instead of a sidebar view', async () => {
    activity('Settings').click();
    await render();
    expect(tabs().map((t) => t.textContent?.trim())).toEqual([expect.stringContaining('Settings')]);
    expect(root.querySelector('.side-head h3')?.textContent).toBe('Spaces');
  });

  it('filters the spaces by name, branch or pane', async () => {
    const input = root.querySelector<HTMLInputElement>('input.filter')!;
    input.value = 'login';
    input.dispatchEvent(new Event('input'));
    await render();
    expect([...root.querySelectorAll('.space-name')].map((e) => e.textContent)).toEqual([
      'web-app',
    ]);
  });

  it('toggles the output panel from the toolbar', async () => {
    const output = [...root.querySelectorAll<HTMLButtonElement>('hx-app-toolbar button')].find(
      (b) => b.textContent?.includes('Output'),
    )!;
    output.click();
    await render();
    expect(root.querySelector('section.output')).not.toBeNull();
    output.click();
    await render();
    expect(root.querySelector('section.output')).toBeNull();
  });
});
