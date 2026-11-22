import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HxDiffView,
  type HxDiffLayout,
  type HxDiffReplyAdded,
  type HxDiffResolvedChange,
} from '../diff/diff-view';
import { type HxDiffComment } from './comment-extension';
import { type HxDiffFinding } from './finding-extension';
import { type HxDiffThread, relativeTime } from './thread-extension';

@Component({
  imports: [HxDiffView],
  template: `<hx-diff-view
    aria-label="Changes"
    [original]="original"
    [modified]="modified"
    [layout]="layout()"
    [comments]="comments()"
    [findings]="findings()"
    [threads]="threads()"
    [renderComment]="render()"
    [commentable]="true"
    (replyAdded)="replies.push($event)"
    (resolvedChange)="resolves.push($event)"
  />`,
})
class Host {
  readonly original = 'one\ntwo\nthree\nfour';
  readonly modified = 'one\ntwo changed\nthree\nfour';
  readonly layout = signal<HxDiffLayout>('split');
  readonly comments = signal<readonly HxDiffComment[]>([]);
  readonly findings = signal<readonly HxDiffFinding[]>([]);
  readonly threads = signal<readonly HxDiffThread[]>([]);
  readonly render = signal<((text: string) => string) | null>(null);
  readonly replies: HxDiffReplyAdded[] = [];
  readonly resolves: HxDiffResolvedChange[] = [];
}

const ago = (ms: number): string => new Date(Date.now() - ms).toISOString();

const thread = (over: Partial<HxDiffThread> = {}): HxDiffThread => ({
  id: 't1',
  side: 'modified',
  startLine: 2,
  endLine: 2,
  resolved: false,
  comments: [
    { id: 'a', author: 'Ada', time: ago(3 * 3600_000), text: 'Why changed?' },
    { id: 'b', author: 'Bob', time: ago(60_000), text: 'For tax.' },
  ],
  ...over,
});

describe('relativeTime', () => {
  it('formats past times and ignores invalid ones', () => {
    const now = Date.parse('2026-11-22T12:00:00Z');
    expect(relativeTime('2026-11-22T09:00:00Z', now)).toBe('3 hours ago');
    expect(relativeTime('2026-11-20T12:00:00Z', now)).toBe('2 days ago');
    expect(relativeTime('nope', now)).toBe('');
  });
});

describe('review threads', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = () => fixture.nativeElement as HTMLElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('shows the comments in order with author, relative time and full time in title', async () => {
    host.threads.set([thread()]);
    await settle();
    const items = el().querySelectorAll('.cm-merge-b .cm-thread-box .cm-thread-comment');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Ada');
    expect(items[0].textContent).toContain('Why changed?');
    expect(items[1].textContent).toContain('Bob');
    const time = items[0].querySelector<HTMLElement>('time')!;
    expect(time.textContent).toBe('3 hours ago');
    expect(time.title).not.toBe('');
    expect(el().querySelector('.cm-merge-a .cm-thread-box')).toBeNull();
  });

  it('emits replyAdded from the reply field and clears it', async () => {
    host.threads.set([thread()]);
    await settle();
    const input = el().querySelector<HTMLTextAreaElement>('.cm-thread-input')!;
    const send = el().querySelector<HTMLButtonElement>('.cm-thread-reply')!;
    expect(send.disabled).toBe(true);
    input.value = '  Thanks  ';
    input.dispatchEvent(new Event('input'));
    expect(send.disabled).toBe(false);
    send.click();
    expect(host.replies).toEqual([{ threadId: 't1', text: 'Thanks' }]);
    expect(input.value).toBe('');
  });

  it('collapses a resolved thread to one line and expands on click', async () => {
    host.threads.set([thread({ resolved: true })]);
    await settle();
    const box = el().querySelector('.cm-thread-box')!;
    expect(box.classList.contains('cm-thread-collapsed')).toBe(true);
    expect(box.querySelector('.cm-thread-comment')).toBeNull();
    el().querySelector<HTMLButtonElement>('.cm-thread-toggle')!.click();
    await settle();
    expect(el().querySelectorAll('.cm-thread-comment').length).toBe(2);
    expect(el().querySelector('.cm-thread-toggle')!.getAttribute('aria-expanded')).toBe('true');
    el().querySelector<HTMLButtonElement>('.cm-thread-toggle')!.click();
    await settle();
    expect(el().querySelector('.cm-thread-comment')).toBeNull();
  });

  it('emits resolvedChange from the button', async () => {
    host.threads.set([thread()]);
    await settle();
    el().querySelector<HTMLButtonElement>('.cm-thread-resolve')!.click();
    host.threads.set([thread({ resolved: true })]);
    await settle();
    el().querySelector<HTMLButtonElement>('.cm-thread-resolve')!.click();
    expect(host.resolves).toEqual([
      { threadId: 't1', resolved: true },
      { threadId: 't1', resolved: false },
    ]);
  });

  it('shows plain text by default and sanitized HTML with renderComment', async () => {
    host.threads.set([
      thread({ comments: [{ id: 'a', author: 'Ada', time: ago(1000), text: '**x**' }] }),
    ]);
    await settle();
    expect(el().querySelector('.cm-thread-text')!.innerHTML).toBe('**x**');
    host.render.set(
      (t) => `<b>${t.slice(2, -2)}</b><img src="x" onerror="alert(1)"><script>alert(1)</script>`,
    );
    await settle();
    const text = el().querySelector('.cm-thread-text')!;
    expect(text.querySelector('b')!.textContent).toBe('x');
    expect(text.querySelector('script')).toBeNull();
    expect(text.querySelector('[onerror]')).toBeNull();
  });

  it('works together with comments, in the order findings, threads, comments', async () => {
    host.comments.set([{ id: 'c1', side: 'modified', startLine: 2, endLine: 2, text: 'Hm' }]);
    host.threads.set([thread()]);
    host.findings.set([
      { id: 'f', side: 'modified', startLine: 2, endLine: 2, severity: 'note', title: 'T' },
    ]);
    await settle();
    const boxes = [
      ...el().querySelectorAll(
        '.cm-merge-b .cm-finding-box, .cm-merge-b .cm-thread-box, .cm-merge-b .cm-comment-box',
      ),
    ].map((b) => b.className.split(' ')[0]);
    expect(boxes).toEqual(['cm-finding-box', 'cm-thread-box', 'cm-comment-box']);
  });

  it('shows a thread in unified layout and ignores one outside the text', async () => {
    host.layout.set('unified');
    host.threads.set([thread(), thread({ id: 'x', endLine: 99 })]);
    await settle();
    expect(el().querySelectorAll('.cm-thread-box').length).toBe(1);
  });
});
