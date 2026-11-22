import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { type HxChangedFile, HxChangedFileActions, HxChangedFiles } from './changed-files';

const FILES: HxChangedFile[] = [
  { path: 'src/app/a.ts', status: 'modified', additions: 3, deletions: 1 },
  { path: 'src/b.ts', oldPath: 'src/old-b.ts', status: 'renamed', additions: 0, deletions: 0 },
  { path: 'logo.png', status: 'added', binary: true },
  { path: 'README.md', status: 'untracked' },
];

@Component({
  imports: [HxChangedFiles, HxChangedFileActions],
  template: `
    <hx-changed-files
      aria-label="Changes"
      [files]="files()"
      [selected]="selected()"
      (selectedChange)="picked.push($event); selected.set($event)"
    >
      @if (withActions) {
        <ng-template hxChangedFileActions let-file>
          <button type="button" class="act">Stage {{ file.path }}</button>
        </ng-template>
      }
    </hx-changed-files>
  `,
})
class Host {
  files = signal<HxChangedFile[]>(FILES);
  selected = signal<string | null>(null);
  picked: string[] = [];
  withActions = false;
}

describe('HxChangedFiles', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const list = () => el().querySelector<HTMLElement>('[role=listbox]')!;
  const options = () => [...el().querySelectorAll<HTMLElement>('[role=option]')];
  const key = (k: string) => {
    list().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('has listbox roles and an accessible name', () => {
    expect(list().getAttribute('aria-label')).toBe('Changes');
    expect(options().length).toBe(4);
  });

  it('shows letter, name, muted folder and counts', () => {
    const first = options()[0];
    expect(first.querySelector('.hx-changed-files-status')?.textContent?.trim()).toBe('M');
    expect(first.querySelector('.hx-changed-files-name')?.textContent).toBe('a.ts');
    expect(first.querySelector('.hx-changed-files-folder')?.textContent).toBe('src/app');
    expect(first.querySelector('.hx-changed-files-counts')?.textContent).toContain('+3');
    expect(first.querySelector('.hx-changed-files-counts')?.textContent).toContain('−1');
  });

  it('carries the status as text, not color alone', () => {
    expect(options()[0].querySelector('.hx-changed-files-sr')?.textContent).toContain('Modified');
  });

  it('shows the old path of a renamed file', () => {
    expect(options()[1].querySelector('.hx-changed-files-old')?.textContent).toContain(
      'src/old-b.ts',
    );
  });

  it('shows "binary" instead of counts', () => {
    const o = options()[2];
    expect(o.querySelector('.hx-changed-files-binary')?.textContent).toBe('binary');
    expect(o.querySelector('.hx-changed-files-counts')).toBeNull();
  });

  it('shows no counts when none are given', () => {
    expect(options()[3].querySelector('.hx-changed-files-counts')).toBeNull();
  });

  it('shows the file count and totals', () => {
    const header = el().querySelector('.hx-changed-files-header')!.textContent!;
    expect(header).toContain('4 files');
    expect(header).toContain('+3');
    expect(header).toContain('−1');
  });

  it('uses the singular for one file', () => {
    fixture.componentInstance.files.set([FILES[0]]);
    fixture.detectChanges();
    expect(el().querySelector('.hx-changed-files-count')?.textContent).toBe('1 file');
  });

  it('marks the selected file', () => {
    fixture.componentInstance.selected.set('src/b.ts');
    fixture.detectChanges();
    expect(options().map((o) => o.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
      'false',
      'false',
    ]);
  });

  it('selects on click', () => {
    options()[2].click();
    expect(fixture.componentInstance.picked).toEqual(['logo.png']);
  });

  it('moves with arrow keys and selects with Enter', () => {
    key('ArrowDown');
    key('ArrowDown');
    expect(list().getAttribute('aria-activedescendant')).toBe(options()[2].id);
    key('Enter');
    expect(fixture.componentInstance.picked).toEqual(['logo.png']);
    key('ArrowUp');
    key('Enter');
    expect(fixture.componentInstance.picked).toEqual(['logo.png', 'src/b.ts']);
  });

  it('stays inside the list and supports Home and End', () => {
    key('ArrowUp');
    expect(list().getAttribute('aria-activedescendant')).toBe(options()[0].id);
    key('End');
    key('ArrowDown');
    expect(list().getAttribute('aria-activedescendant')).toBe(options()[3].id);
    key('Home');
    expect(list().getAttribute('aria-activedescendant')).toBe(options()[0].id);
  });

  it('starts the active row at the selected file', () => {
    fixture.componentInstance.selected.set('logo.png');
    fixture.detectChanges();
    expect(list().getAttribute('aria-activedescendant')).toBe(options()[2].id);
  });

  it('handles an empty list', () => {
    fixture.componentInstance.files.set([]);
    fixture.detectChanges();
    key('ArrowDown');
    key('Enter');
    expect(list().hasAttribute('aria-activedescendant')).toBe(false);
    expect(fixture.componentInstance.picked).toEqual([]);
  });

  it('renders the row slot outside the option and does not select on its click', () => {
    TestBed.resetTestingModule();
    fixture = TestBed.createComponent(Host);
    fixture.componentInstance.withActions = true;
    fixture.detectChanges();
    const buttons = el().querySelectorAll<HTMLElement>('.act');
    expect(buttons.length).toBe(4);
    expect(buttons[0].textContent).toContain('Stage src/app/a.ts');
    expect(buttons[0].closest('[role=option]')).toBeNull();
    buttons[0].click();
    expect(fixture.componentInstance.picked).toEqual([]);
  });
});
