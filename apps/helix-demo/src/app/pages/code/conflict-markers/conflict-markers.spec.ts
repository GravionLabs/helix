import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { ConflictMarkersDemo } from './conflict-markers';

describe('ConflictMarkersDemo', () => {
  let fixture: ComponentFixture<ConflictMarkersDemo>;
  const el = () => fixture.nativeElement as HTMLElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

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
    fixture = TestBed.createComponent(ConflictMarkersDemo);
    await settle();
  });

  it('shows two conflicts and resolves one with an action', async () => {
    expect(el().querySelectorAll('.cm-hx-conflict-actions')).toHaveLength(2);
    expect(el().querySelector('[role="status"]')?.textContent).toContain('2 conflicts left');
    el().querySelector<HTMLButtonElement>('.cm-hx-conflict-action-ours')!.click();
    await settle();
    expect(el().querySelectorAll('.cm-hx-conflict-actions')).toHaveLength(1);
    expect(el().querySelector('[role="status"]')?.textContent).toContain('1 conflict left');
  });
});
