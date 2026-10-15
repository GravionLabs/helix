import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxTree } from '@gravionlabs/helix-ui';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { TreeDemo } from './tree-demo';

describe('TreeDemo', () => {
  function create() {
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
    const fixture = TestBed.createComponent(TreeDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('renders four trees: files, single, checkbox with filter and lazy', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelectorAll('hx-tree')).toHaveLength(4);
    expect(el.querySelectorAll('.card .demo-title')).toHaveLength(4);
    expect(el.querySelector('hx-data-table, table')).toBeNull();
  });

  it('starts with report selected in the single selection tree', () => {
    const fixture = create();
    expect(fixture.componentInstance.single()).toBe('report');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Selected: report');
  });

  it('shows the checked keys of the checkbox tree', () => {
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('Checked: song');
    fixture.componentInstance.checked.set(['song']);
    fixture.detectChanges();
    expect(el.textContent).toContain('Checked: song');
  });

  /** The lazy tree is the last of the four cards. */
  const lazyTree = (fixture: ReturnType<typeof create>) =>
    fixture.debugElement.queryAll(By.directive(HxTree)).at(-1);

  it('loads the disks of a server when it is opened, and not twice', () => {
    vi.useFakeTimers();
    try {
      const fixture = create();
      const cmp = fixture.componentInstance;
      const tree = lazyTree(fixture);
      if (!tree) throw new Error('lazy tree not found');
      tree.triggerEventHandler('nodeExpand', { node: cmp.lazy()[0] });
      expect(cmp.lazy()[0].loading).toBe(true);
      vi.advanceTimersByTime(800);
      expect(cmp.lazy()[0].loading).toBe(false);
      expect(cmp.lazy()[0].children?.map((c) => c.label)).toEqual(['Disk 1', 'Disk 2']);
      const loaded = cmp.lazy()[0].children;
      tree.triggerEventHandler('nodeExpand', { node: cmp.lazy()[0] });
      expect(cmp.lazy()[0].loading).toBe(false);
      expect(cmp.lazy()[0].children).toBe(loaded);
      expect(cmp.lazy()[1].children).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });
});
