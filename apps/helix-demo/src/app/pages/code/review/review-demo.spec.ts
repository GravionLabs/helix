import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { ReviewDemo } from './review-demo';

describe('ReviewDemo', () => {
  let fixture: ComponentFixture<ReviewDemo>;
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
    fixture = TestBed.createComponent(ReviewDemo);
    await settle();
  });

  it('shows the existing comment', () => {
    expect(el().querySelector('.cm-comment-box')?.textContent).toContain('negative tax');
    expect(el().textContent).toContain('1 comment(s)');
  });

  it('adds a comment from the draft box', async () => {
    const number = [...el().querySelectorAll('.cm-merge-b .cm-lineNumbers .cm-gutterElement')]
      .slice(1)
      .find((e) => e.textContent === '2')!;
    number.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    await settle();
    const input = el().querySelector<HTMLTextAreaElement>('.cm-comment-input')!;
    input.value = 'Why start at zero?';
    input.dispatchEvent(new Event('input'));
    el().querySelector<HTMLButtonElement>('.cm-comment-save')!.click();
    await settle();
    expect(el().textContent).toContain('2 comment(s)');
    expect(el().textContent).toContain('Why start at zero?');
  });

  it('shows a blocking finding and a note', () => {
    const boxes = [...el().querySelectorAll('.cm-finding-box')];
    expect(boxes.map((b) => b.classList.contains('cm-finding-blocking'))).toContain(true);
    expect(boxes.map((b) => b.classList.contains('cm-finding-note'))).toContain(true);
    expect(boxes.map((b) => b.textContent).join()).toContain('Negative tax');
  });

  it('reports the quote when the finding action is used', async () => {
    el().querySelector<HTMLButtonElement>('.cm-finding-blocking .cm-finding-action')!.click();
    await settle();
    expect(el().textContent).toContain('Sent finding f1');
    expect(el().textContent).toContain('return sum * (1 + tax);');
  });
});
