import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxConflictMerge } from './conflict-merge';

const MINE = 'a\nb\nc\nd\n';
const THEIRS = 'a\nB\nc\nD\n';

describe('HxConflictMerge', () => {
  let fixture: ComponentFixture<HxConflictMerge>;
  const el = () => fixture.nativeElement as HTMLElement;
  const radio = (group: number, value: string) =>
    el().querySelector<HTMLInputElement>(`input[name$="-${group}"][value="${value}"]`)!;
  const textarea = () => el().querySelector<HTMLTextAreaElement>('textarea')!;
  const button = (cls: string) =>
    el().querySelector<HTMLButtonElement>(`.hx-conflict-merge-${cls}`)!;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const edit = async (value: string) => {
    textarea().value = value;
    textarea().dispatchEvent(new Event('input'));
    await settle();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(HxConflictMerge);
    fixture.componentRef.setInput('mine', MINE);
    fixture.componentRef.setInput('theirs', THEIRS);
    await settle();
  });

  it('shows the number of differing parts and both sides with three choices', () => {
    expect(el().querySelector('[role="status"]')?.textContent).toContain('2 differences');
    expect(el().querySelectorAll('fieldset')).toHaveLength(2);
    expect(el().querySelectorAll('[role="radiogroup"][aria-label]')).toHaveLength(2);
    expect(el().querySelectorAll('input[type="radio"]')).toHaveLength(6);
    expect(el().textContent).toContain('Mine');
    expect(el().textContent).toContain('Theirs');
  });

  it('uses the labels and defaults to mine', async () => {
    fixture.componentRef.setInput('mineLabel', 'Local');
    fixture.componentRef.setInput('theirsLabel', 'Remote');
    await settle();
    expect(el().textContent).toContain('Local');
    expect(el().textContent).toContain('Remote');
    expect(radio(0, 'mine').checked).toBe(true);
    expect(fixture.componentInstance.result()).toBe(MINE);
    expect(fixture.componentInstance.unresolved()).toBe(2);
  });

  it('merges by choice and counts unresolved parts', async () => {
    radio(0, 'theirs').click();
    radio(1, 'both').click();
    await settle();
    expect(fixture.componentInstance.result()).toBe('a\nB\nc\nd\nD\n');
    expect(fixture.componentInstance.unresolved()).toBe(0);
    expect(textarea().value).toBe('a\nB\nc\nd\nD\n');
  });

  it('counts a click on the default choice as chosen', async () => {
    radio(0, 'mine').click();
    await settle();
    expect(fixture.componentInstance.unresolved()).toBe(1);
  });

  it('resets choices and the edit when an input changes', async () => {
    radio(0, 'theirs').click();
    await edit('own');
    fixture.componentRef.setInput('theirs', 'a\nX\nc\nd\n');
    await settle();
    expect(fixture.componentInstance.unresolved()).toBe(1);
    expect(textarea().value).toBe(MINE);
    expect(radio(0, 'mine').checked).toBe(true);
  });

  it('asks before a changed choice overwrites an edit, and overwrites', async () => {
    await edit('own text');
    radio(0, 'theirs').click();
    await settle();
    expect(el().querySelector('[role="alert"]')).not.toBeNull();
    expect(radio(0, 'mine').checked).toBe(true);
    expect(textarea().value).toBe('own text');
    button('overwrite').click();
    await settle();
    expect(el().querySelector('[role="alert"]')).toBeNull();
    expect(textarea().value).toBe('a\nB\nc\nd\n');
    expect(radio(0, 'theirs').checked).toBe(true);
  });

  it('keeps the edit and the old choice on Keep edit', async () => {
    await edit('own text');
    radio(0, 'theirs').click();
    await settle();
    button('keep').click();
    await settle();
    expect(el().querySelector('[role="alert"]')).toBeNull();
    expect(textarea().value).toBe('own text');
    expect(radio(0, 'mine').checked).toBe(true);
    expect(fixture.componentInstance.unresolved()).toBe(2);
  });

  it('emits the edited text on confirm even with unresolved parts', async () => {
    const merged: string[] = [];
    fixture.componentInstance.merged.subscribe((text) => merged.push(text));
    button('confirm').click();
    await edit('hand made');
    button('confirm').click();
    expect(merged).toEqual([MINE, 'hand made']);
  });

  it('emits cancelled', () => {
    let cancelled = 0;
    fixture.componentInstance.cancelled.subscribe(() => cancelled++);
    button('cancel').click();
    expect(cancelled).toBe(1);
  });

  it('renders no dialog and no differences for equal texts', async () => {
    fixture.componentRef.setInput('theirs', MINE);
    await settle();
    expect(el().querySelector('[role="dialog"], hx-dialog')).toBeNull();
    expect(el().querySelector('[role="status"]')?.textContent).toContain('0 differences');
    expect(textarea().value).toBe(MINE);
  });
});
