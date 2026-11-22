import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorView } from '@codemirror/view';
import { HxDiffView, type HxDiffCommentAdded, type HxDiffLayout } from '../diff/diff-view';
import { type HxDiffComment, openCommentDraft } from './comment-extension';

@Component({
  imports: [HxDiffView],
  template: `<hx-diff-view
    aria-label="Changes"
    [original]="original"
    [modified]="modified"
    [layout]="layout()"
    [comments]="comments()"
    [commentable]="commentable()"
    (commentAdded)="added.push($event)"
  />`,
})
class Host {
  readonly original = 'one\ntwo\nthree\nfour';
  readonly modified = 'one\ntwo changed\nthree\nfour';
  readonly layout = signal<HxDiffLayout>('split');
  readonly comments = signal<readonly HxDiffComment[]>([]);
  readonly commentable = signal(true);
  readonly added: HxDiffCommentAdded[] = [];
}

const comment = (over: Partial<HxDiffComment> = {}): HxDiffComment => ({
  id: 'c1',
  side: 'modified',
  startLine: 2,
  endLine: 2,
  text: 'Why?',
  author: 'Ada',
  time: '2026-01-02T03:04:05Z',
  ...over,
});

describe('line comments', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = () => fixture.nativeElement as HTMLElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const editor = (side: 'a' | 'b') =>
    EditorView.findFromDOM(el().querySelector<HTMLElement>(`.cm-merge-${side}`)!)!;
  const numbers = (side: 'a' | 'b') =>
    [...el().querySelectorAll(`.cm-merge-${side} .cm-lineNumbers .cm-gutterElement`)]
      .slice(1)
      .filter((e) => /^\d+$/.test(e.textContent ?? '')) as HTMLElement[];
  const click = (target: HTMLElement, shiftKey = false) => {
    const box = target.getBoundingClientRect();
    target.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        shiftKey,
        clientX: box.left + 2,
        clientY: box.top + box.height / 2,
      }),
    );
  };
  const input = () => el().querySelector<HTMLTextAreaElement>('.cm-comment-input')!;
  const type = async (value: string) => {
    input().value = value;
    input().dispatchEvent(new Event('input'));
  };
  const key = (init: KeyboardEventInit) =>
    input().dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
    );

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('does nothing without commentable', async () => {
    host.commentable.set(false);
    host.comments.set([comment()]);
    await settle();
    click(numbers('b')[1]);
    await settle();
    expect(el().querySelector('.cm-comment-box')).toBeNull();
  });

  it('opens a draft below the clicked line and marks the lines', async () => {
    click(numbers('b')[1]);
    await settle();
    expect(el().querySelectorAll('.cm-comment-draft').length).toBe(1);
    expect(el().querySelector('.cm-merge-b .cm-draft-line')?.textContent).toContain('two changed');
    expect(input().placeholder).toBe('Comment on line 2');
  });

  it('extends the range with shift-click and keeps the typed text', async () => {
    click(numbers('b')[1]);
    await settle();
    await type('draft text');
    click(numbers('b')[3], true);
    await settle();
    expect(input().placeholder).toBe('Comment on lines 2-4');
    expect(input().value).toBe('draft text');
    expect(el().querySelectorAll('.cm-merge-b .cm-draft-line').length).toBe(3);
  });

  it('saves with Ctrl+Enter and emits side, lines, text and quote', async () => {
    click(numbers('b')[1]);
    click(numbers('b')[2], true);
    await settle();
    await type('Looks wrong');
    key({ key: 'Enter', ctrlKey: true });
    await settle();
    expect(host.added).toEqual([
      {
        side: 'modified',
        startLine: 2,
        endLine: 3,
        text: 'Looks wrong',
        quote: 'two changed\nthree',
      },
    ]);
    expect(el().querySelector('.cm-comment-draft')).toBeNull();
  });

  it('saves with the button on the original side and with Cmd+Enter', async () => {
    click(numbers('a')[1]);
    await settle();
    await type('old');
    el().querySelector<HTMLButtonElement>('.cm-comment-save')!.click();
    await settle();
    click(numbers('b')[0]);
    await settle();
    await type('new');
    key({ key: 'Enter', metaKey: true });
    expect(host.added.map((a) => [a.side, a.quote])).toEqual([
      ['original', 'two'],
      ['modified', 'one'],
    ]);
  });

  it('cannot save an empty text', async () => {
    click(numbers('b')[1]);
    await settle();
    const save = el().querySelector<HTMLButtonElement>('.cm-comment-save')!;
    expect(save.disabled).toBe(true);
    await type('   ');
    key({ key: 'Enter', ctrlKey: true });
    expect(host.added).toEqual([]);
    expect(el().querySelector('.cm-comment-draft')).not.toBeNull();
    await type('x');
    expect(save.disabled).toBe(false);
  });

  it('closes the draft with Escape and Cancel, and focuses the editor again', async () => {
    click(numbers('b')[1]);
    await settle();
    key({ key: 'Escape' });
    await settle();
    expect(el().querySelector('.cm-comment-draft')).toBeNull();
    click(numbers('b')[1]);
    await settle();
    el().querySelector<HTMLButtonElement>('.cm-comment-cancel')!.click();
    await settle();
    expect(el().querySelector('.cm-comment-draft')).toBeNull();
    expect(host.added).toEqual([]);
    expect(editor('b').hasFocus).toBe(true);
  });

  it('keeps one draft: opening one on the other side closes the first', async () => {
    click(numbers('b')[1]);
    click(numbers('a')[0]);
    await settle();
    expect(el().querySelectorAll('.cm-comment-draft').length).toBe(1);
    expect(el().querySelector('.cm-merge-a .cm-comment-draft')).not.toBeNull();
  });

  it('shows comments below their end line on the right side, in both layouts', async () => {
    host.comments.set([
      comment(),
      comment({ id: 'c2', side: 'original', startLine: 1, endLine: 2, text: 'Old' }),
    ]);
    await settle();
    expect(el().querySelectorAll('.cm-merge-b .cm-comment-box').length).toBe(1);
    expect(el().querySelector('.cm-merge-b .cm-comment-box')?.textContent).toContain('Ada');
    expect(el().querySelector('.cm-merge-b .cm-comment-box')?.textContent).toContain('Why?');
    expect(el().querySelectorAll('.cm-merge-a .cm-comment-box').length).toBe(1);
    expect(el().querySelectorAll('.cm-merge-a .cm-commented-line').length).toBe(2);
    host.layout.set('unified');
    await settle();
    expect(el().querySelectorAll('.cm-comment-box').length).toBe(2);
  });

  it('opens a draft in the unified layout on the modified side', async () => {
    host.layout.set('unified');
    await settle();
    const gutter = [...el().querySelectorAll('.cm-lineNumbers .cm-gutterElement')]
      .slice(1)
      .filter((e) => /^\d+$/.test(e.textContent ?? '')) as HTMLElement[];
    click(gutter[0]);
    await settle();
    input().value = 'u';
    input().dispatchEvent(new Event('input'));
    key({ key: 'Enter', ctrlKey: true });
    expect(host.added[0]).toMatchObject({ side: 'modified', startLine: 1, quote: 'one' });
  });

  it('updates the boxes without a rebuild and keeps an open draft', async () => {
    const before = el().querySelector('.cm-editor');
    click(numbers('b')[0]);
    await settle();
    await type('typing');
    const box = el().querySelector('.cm-comment-draft');
    host.comments.set([comment()]);
    await settle();
    expect(el().querySelector('.cm-editor')).toBe(before);
    expect(el().querySelector('.cm-comment-draft')).toBe(box);
    expect(input().value).toBe('typing');
    expect(el().querySelectorAll('.cm-merge-b .cm-comment-box:not(.cm-comment-draft)').length).toBe(
      1,
    );
    host.comments.set([]);
    await settle();
    expect(el().querySelectorAll('.cm-merge-b .cm-comment-box:not(.cm-comment-draft)').length).toBe(
      0,
    );
    expect(el().querySelector('.cm-comment-draft')).toBe(box);
  });

  it('ignores comments outside the text', async () => {
    host.comments.set([
      comment({ startLine: 9, endLine: 9 }),
      comment({ id: 'x', startLine: 3, endLine: 2 }),
    ]);
    await settle();
    expect(el().querySelector('.cm-comment-box')).toBeNull();
  });

  it('opens the draft by the command on the line of the cursor and moves focus into it', async () => {
    const view = editor('b');
    view.dispatch({ selection: { anchor: view.state.doc.line(3).from } });
    expect(openCommentDraft(view)).toBe(true);
    await settle();
    await new Promise((r) => setTimeout(r));
    expect(input().placeholder).toBe('Comment on line 3');
    expect(document.activeElement).toBe(input());
  });

  it('the command does nothing when the view is not commentable', async () => {
    host.commentable.set(false);
    await settle();
    expect(openCommentDraft(editor('b'))).toBe(false);
  });

  it('uses only --h-* tokens for colors', () => {
    const css = [...document.querySelectorAll('style')]
      .map((s) => s.textContent ?? '')
      .join('\n')
      .split('}')
      .filter((rule) => rule.includes('.cm-comment'))
      .join('}');
    expect(css).toContain('--h-primary-color');
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|--term-|--app-/i);
  });
});
