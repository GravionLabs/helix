import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { ConflictMergeDemo } from './conflict-merge-demo';

describe('ConflictMergeDemo', () => {
  let fixture: ComponentFixture<ConflictMergeDemo>;
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
    fixture = TestBed.createComponent(ConflictMergeDemo);
    await settle();
  });

  it('merges inside the dialog and shows the result', async () => {
    el().querySelector<HTMLButtonElement>('.p-button')!.click();
    await settle();
    const merge = document.querySelector('hx-conflict-merge');
    expect(merge).not.toBeNull();
    merge!.querySelector<HTMLInputElement>('input[value="theirs"]')!.click();
    await settle();
    merge!.querySelector<HTMLButtonElement>('.hx-conflict-merge-confirm')!.click();
    await settle();
    expect(el().querySelector('[aria-label="Merged text"]')?.textContent).toContain('oat milk');
  });
});
