import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeDiffDemo } from './code-diff-demo';

describe('CodeDiffDemo', () => {
  let fixture: ComponentFixture<CodeDiffDemo>;
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
    fixture = TestBed.createComponent(CodeDiffDemo);
    await settle();
  });

  it('renders a split diff', () => {
    expect(el().querySelectorAll('.cm-editor').length).toBe(2);
    expect(el().querySelector('.cm-merge-b .cm-content')?.textContent).toContain('greeting');
  });

  it('switches to the unified layout', async () => {
    const unified = [...el().querySelectorAll('input[name=layout]')][1] as HTMLInputElement;
    unified.click();
    await settle();
    expect(el().querySelectorAll('.cm-editor').length).toBe(1);
    expect(el().querySelector('.cm-deletedChunk')).not.toBeNull();
  });

  it('shows a new file', async () => {
    [...el().querySelectorAll('button')].find((b) => b.textContent?.trim() === 'New file')!.click();
    await settle();
    expect(el().querySelector('.cm-merge-b .cm-content')?.textContent).toContain('greeting');
  });

  it('steps through the changes with a count', async () => {
    const button = (label: string) =>
      [...el().querySelectorAll('button')].find((b) => b.textContent?.trim() === label)!;
    expect(el().textContent).toContain('0 of 2');
    button('Next change').click();
    await settle();
    expect(el().textContent).toContain('1 of 2');
    button('Previous change').click();
    await settle();
    expect(el().textContent).toContain('2 of 2');
  });
});
