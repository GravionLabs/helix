import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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

  it('loads the disks of a server when it is opened, and not twice', () => {
    vi.useFakeTimers();
    try {
      const { componentInstance: cmp } = create();
      const node = cmp.lazy()[0];
      cmp.load({ node } as never);
      expect(cmp.lazy()[0].loading).toBe(true);
      vi.advanceTimersByTime(800);
      expect(cmp.lazy()[0].loading).toBe(false);
      expect(cmp.lazy()[0].children?.map((c) => c.label)).toEqual(['Disk 1', 'Disk 2']);
      cmp.load({ node: cmp.lazy()[0] } as never);
      expect(cmp.lazy()[0].loading).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
