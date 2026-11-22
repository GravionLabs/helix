import { history, undo } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import {
  hxConflictCount,
  hxConflictMarkers,
  hxNextConflict,
  hxPreviousConflict,
} from './conflict-markers';

const block = (o: string, t: string, base?: string) =>
  [
    '<<<<<<< HEAD',
    o,
    ...(base === undefined ? [] : ['||||||| base', base]),
    '=======',
    t,
    '>>>>>>> topic',
  ].join('\n');

describe('hxConflictMarkers', () => {
  let view: EditorView;
  const open = (doc: string, anchor = 0) => {
    const parent = document.createElement('div');
    document.body.append(parent);
    view = new EditorView({
      parent,
      state: EditorState.create({
        doc,
        selection: { anchor },
        extensions: [history(), hxConflictMarkers()],
      }),
    });
    return view;
  };
  const buttons = () => [...view.dom.querySelectorAll<HTMLButtonElement>('.cm-hx-conflict-action')];
  const press = (text: string, i = 0) =>
    buttons()
      .filter((b) => b.textContent === text)
      [i].click();

  afterEach(() => {
    view.dom.parentElement?.remove();
    view.destroy();
  });

  it('counts conflicts and colors the sides', () => {
    open(`a\n${block('mine', 'theirs', 'orig')}\nz`);
    expect(hxConflictCount(view.state)).toBe(1);
    expect(view.dom.querySelectorAll('.cm-hx-conflict-ours')).toHaveLength(1);
    expect(view.dom.querySelectorAll('.cm-hx-conflict-base')).toHaveLength(1);
    expect(view.dom.querySelectorAll('.cm-hx-conflict-theirs')).toHaveLength(1);
    expect(view.dom.querySelectorAll('.cm-hx-conflict-marker')).toHaveLength(4);
  });

  it('counts 0 without the extension', () => {
    expect(hxConflictCount(EditorState.create({ doc: block('a', 'b') }))).toBe(0);
  });

  it('shows labeled, named actions above each conflict', () => {
    open(`${block('a', 'b')}\n${block('c', 'd')}`);
    expect(view.dom.querySelectorAll('.cm-hx-conflict-actions')).toHaveLength(2);
    const first = buttons()[0];
    expect(first.type).toBe('button');
    expect(first.getAttribute('aria-label')).toBe('Accept ours: HEAD');
    expect(buttons()[1].getAttribute('aria-label')).toBe('Accept theirs: topic');
    expect(buttons()[2].getAttribute('aria-label')).toBe('Accept both: HEAD and topic');
    expect(view.dom.querySelector('.cm-hx-conflict-actions')?.getAttribute('aria-label')).toBe(
      'Conflict 1 of 2',
    );
  });

  it('accepts ours, theirs and both', () => {
    open(`a\n${block('o1\no2', 't1', 'b')}\nz`);
    press('Accept ours');
    expect(view.state.doc.toString()).toBe('a\no1\no2\nz');
    expect(hxConflictCount(view.state)).toBe(0);
    view.destroy();
    open(`a\n${block('o1\no2', 't1', 'b')}\nz`);
    press('Accept theirs');
    expect(view.state.doc.toString()).toBe('a\nt1\nz');
    view.destroy();
    open(`a\n${block('o1\no2', 't1', 'b')}\nz`);
    press('Accept both');
    expect(view.state.doc.toString()).toBe('a\no1\no2\nt1\nz');
  });

  it('leaves no empty line when the chosen side is empty', () => {
    open('a\n<<<<<<< x\n=======\nt\n>>>>>>> y\nz');
    press('Accept ours');
    expect(view.state.doc.toString()).toBe('a\nz');
    view.destroy();
    open('a\n<<<<<<< x\n=======\nt\n>>>>>>> y');
    press('Accept ours');
    expect(view.state.doc.toString()).toBe('a');
    view.destroy();
    open('<<<<<<< x\n=======\n>>>>>>> y');
    press('Accept both');
    expect(view.state.doc.toString()).toBe('');
  });

  it('resolves the second conflict and undoes it in one step', () => {
    const doc = `${block('a', 'b')}\nmid\n${block('c', 'd')}`;
    open(doc);
    press('Accept theirs', 1);
    expect(view.state.doc.toString()).toBe(`${block('a', 'b')}\nmid\nd`);
    expect(hxConflictCount(view.state)).toBe(1);
    undo(view);
    expect(view.state.doc.toString()).toBe(doc);
    expect(hxConflictCount(view.state)).toBe(2);
  });

  it('follows edits: deleting a marker by hand drops the conflict', () => {
    open(`${block('a', 'b')}\n${block('c', 'd')}`);
    expect(hxConflictCount(view.state)).toBe(2);
    const marker = view.state.doc.line(2 + 1); // the ======= of the first conflict
    view.dispatch({ changes: { from: marker.from, to: marker.to + 1 } });
    expect(hxConflictCount(view.state)).toBe(1);
    expect(view.dom.querySelectorAll('.cm-hx-conflict-actions')).toHaveLength(1);
  });

  it('leaves malformed markers as plain text', () => {
    open('<<<<<<< a\nx\n<<<<<<< b\ny');
    expect(hxConflictCount(view.state)).toBe(0);
    expect(view.dom.querySelector('.cm-hx-conflict-actions')).toBeNull();
  });

  it('moves between conflicts and wraps', () => {
    open(`${block('a', 'b')}\nmid\n${block('c', 'd')}`);
    const line = () => view.state.doc.lineAt(view.state.selection.main.head).number;
    expect(hxNextConflict(view)).toBe(true);
    expect(line()).toBe(7);
    hxNextConflict(view);
    expect(line()).toBe(1);
    hxPreviousConflict(view);
    expect(line()).toBe(7);
    hxPreviousConflict(view);
    expect(line()).toBe(1);
  });

  it('the commands return false without conflicts', () => {
    open('plain');
    expect(hxNextConflict(view)).toBe(false);
    expect(hxPreviousConflict(view)).toBe(false);
  });
});
