import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxDiffView, type HxDiffFindingAction, type HxDiffLayout } from '../diff/diff-view';
import { type HxDiffComment } from './comment-extension';
import { type HxDiffFinding } from './finding-extension';

@Component({
  imports: [HxDiffView],
  template: `<hx-diff-view
    aria-label="Changes"
    [original]="original"
    [modified]="modified"
    [layout]="layout()"
    [comments]="comments()"
    [findings]="findings()"
    [commentable]="true"
    [findingActionLabel]="label()"
    (findingAction)="actions.push($event)"
  />`,
})
class Host {
  readonly original = 'one\ntwo\nthree\nfour';
  readonly modified = 'one\ntwo changed\nthree\nfour';
  readonly layout = signal<HxDiffLayout>('split');
  readonly comments = signal<readonly HxDiffComment[]>([]);
  readonly findings = signal<readonly HxDiffFinding[]>([]);
  readonly label = signal('');
  readonly actions: HxDiffFindingAction[] = [];
}

const finding = (over: Partial<HxDiffFinding> = {}): HxDiffFinding => ({
  id: 'f1',
  side: 'modified',
  startLine: 2,
  endLine: 3,
  severity: 'blocking',
  title: 'Wrong result',
  detail: 'It drops the tax.',
  ...over,
});

describe('finding marks', () => {
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

  it('shows a box with severity text, icon, title and detail, and marks the gutter', async () => {
    host.findings.set([finding()]);
    await settle();
    const box = el().querySelector('.cm-merge-b .cm-finding-box')!;
    expect(box.textContent).toContain('Blocking');
    expect(box.textContent).toContain('Wrong result');
    expect(box.textContent).toContain('It drops the tax.');
    expect(box.querySelector('svg.cm-finding-icon')).not.toBeNull();
    expect(el().querySelectorAll('.cm-merge-b .cm-finding-line').length).toBe(2);
    expect(el().querySelectorAll('.cm-merge-b .cm-finding-gutter-blocking').length).toBe(2);
    expect(el().querySelector('.cm-merge-a .cm-finding-box')).toBeNull();
  });

  it('tells a note from a blocking finding by text and icon', async () => {
    host.findings.set([finding({ id: 'n', severity: 'note', detail: undefined })]);
    await settle();
    const box = el().querySelector('.cm-finding-note')!;
    expect(box.textContent).toContain('Note');
    expect(box.querySelector('.cm-finding-detail')).toBeNull();
    expect(el().querySelector('.cm-finding-gutter-note')).not.toBeNull();
  });

  it('shows a finding on the original side in the left editor and in unified layout', async () => {
    host.findings.set([finding({ side: 'original', startLine: 1, endLine: 2 })]);
    await settle();
    expect(el().querySelectorAll('.cm-merge-a .cm-finding-box').length).toBe(1);
    host.layout.set('unified');
    await settle();
    expect(el().querySelectorAll('.cm-finding-box').length).toBe(1);
  });

  it('ignores a finding outside the text', async () => {
    host.findings.set([finding({ endLine: 99 }), finding({ id: 'x', startLine: 0 })]);
    await settle();
    expect(el().querySelector('.cm-finding-box')).toBeNull();
  });

  it('has no button without findingActionLabel', async () => {
    host.findings.set([finding()]);
    await settle();
    expect(el().querySelector('.cm-finding-action')).toBeNull();
  });

  it('emits findingAction with id and the quote of its lines', async () => {
    host.findings.set([
      finding(),
      finding({ id: 'f2', side: 'original', startLine: 2, endLine: 2 }),
    ]);
    host.label.set('Fix');
    await settle();
    const buttons = el().querySelectorAll<HTMLButtonElement>('.cm-finding-action');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('Fix');
    el().querySelector<HTMLButtonElement>('.cm-merge-b .cm-finding-action')!.click();
    el().querySelector<HTMLButtonElement>('.cm-merge-a .cm-finding-action')!.click();
    expect(host.actions).toEqual([
      { id: 'f1', quote: 'two changed\nthree' },
      { id: 'f2', quote: 'two' },
    ]);
  });

  it('quotes the original text in the unified layout', async () => {
    host.layout.set('unified');
    host.findings.set([finding({ side: 'original', startLine: 2, endLine: 2 })]);
    host.label.set('Fix');
    await settle();
    el().querySelector<HTMLButtonElement>('.cm-finding-action')!.click();
    expect(host.actions).toEqual([{ id: 'f1', quote: 'two' }]);
  });

  it('renders findings before comments on the same line', async () => {
    host.comments.set([
      {
        id: 'c1',
        side: 'modified',
        startLine: 3,
        endLine: 3,
        text: 'Why?',
      },
    ]);
    host.findings.set([finding()]);
    await settle();
    const boxes = [
      ...el().querySelectorAll('.cm-merge-b .cm-finding-box, .cm-merge-b .cm-comment-box'),
    ];
    expect(boxes.length).toBe(2);
    expect(boxes[0].classList.contains('cm-finding-box')).toBe(true);
  });
});
