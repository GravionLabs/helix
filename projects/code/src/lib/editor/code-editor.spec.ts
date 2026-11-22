import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  language,
  LanguageDescription,
  LanguageSupport,
  StreamLanguage,
} from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { HX_CODE_LANGUAGES } from '../language/language';
import { HxCodeEditor } from './code-editor';

@Component({
  imports: [HxCodeEditor],
  template: `<hx-code-editor
    aria-label="Source"
    [(value)]="text"
    [path]="path()"
    [readOnly]="readOnly()"
    [lineNumbers]="lineNumbers()"
    [lineWrapping]="lineWrapping()"
    [extensions]="extensions()"
  />`,
})
class Host {
  readonly text = signal('one\ntwo');
  readonly path = signal('');
  readonly readOnly = signal(false);
  readonly lineNumbers = signal(true);
  readonly lineWrapping = signal(false);
  readonly extensions = signal<never[]>([]);
}

@Component({
  imports: [HxCodeEditor, ReactiveFormsModule],
  template: `<hx-code-editor aria-labelledby="lbl" [formControl]="control" />`,
})
class FormHost {
  readonly control = new FormControl('start', { nonNullable: true });
}

const fakeLanguage = LanguageDescription.of({
  name: 'Fake',
  extensions: ['fake'],
  load: async () =>
    new LanguageSupport(
      StreamLanguage.define({
        token: (s) => {
          s.next();
          return null;
        },
      }),
    ),
});

describe('HxCodeEditor', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let editor: HxCodeEditor;

  const view = () => editor.view()!;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const type = (text: string) =>
    view().dispatch({ changes: { from: view().state.doc.length, insert: text } });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: HX_CODE_LANGUAGES, useValue: [fakeLanguage] }],
    });
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
    editor = fixture.debugElement.children[0].componentInstance as HxCodeEditor;
  });

  it('shows the value and exposes the view', () => {
    expect(view()).toBeInstanceOf(EditorView);
    expect(view().state.doc.toString()).toBe('one\ntwo');
  });

  it('emits valueChange on a user edit', async () => {
    type('!');
    await settle();
    expect(host.text()).toBe('one\ntwo!');
  });

  it('updates the document when the binding changes, without rebuilding the view or emitting', async () => {
    const first = view();
    const emitted = vi.fn<() => void>();
    editor.value.subscribe(emitted);
    host.text.set('changed');
    await settle();
    expect(view()).toBe(first);
    expect(view().state.doc.toString()).toBe('changed');
    expect(emitted).not.toHaveBeenCalled();
  });

  it('keeps the view when inputs change', async () => {
    const first = view();
    host.readOnly.set(true);
    host.lineNumbers.set(false);
    host.lineWrapping.set(true);
    host.path.set('a.fake');
    host.extensions.set([EditorView.editable.of(true)] as never[]);
    await settle();
    expect(view()).toBe(first);
    expect(view().state.readOnly).toBe(true);
    expect(view().dom.querySelector('.cm-lineNumbers')).toBeNull();
    expect(view().contentDOM.classList).toContain('cm-lineWrapping');
  });

  it('shows line numbers by default', () => {
    expect(view().dom.querySelector('.cm-lineNumbers')).not.toBeNull();
  });

  it('loads the language of the path from HX_CODE_LANGUAGES', async () => {
    expect(view().state.facet(language)).toBeNull();
    host.path.set('a.fake');
    await settle();
    await new Promise((r) => setTimeout(r));
    expect(view().state.facet(language)).not.toBeNull();
  });

  it('applies the Helix theme', () => {
    expect(view().dom.className).toMatch(/ͼ/);
  });

  it('names the editable element from aria-label', () => {
    expect(view().contentDOM.getAttribute('aria-label')).toBe('Source');
    expect(fixture.nativeElement.querySelector('hx-code-editor').hasAttribute('aria-label')).toBe(
      false,
    );
  });

  it('focuses the editor', () => {
    editor.focus();
    expect(view().hasFocus).toBe(true);
  });

  it('destroys the view with the component', async () => {
    const destroy = vi.spyOn(view(), 'destroy');
    fixture.destroy();
    expect(destroy).toHaveBeenCalled();
  });

  it('emits touch on blur', () => {
    const touched = vi.fn<() => void>();
    editor.touch.subscribe(touched);
    fixture.nativeElement
      .querySelector('hx-code-editor')
      .dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(touched).toHaveBeenCalled();
  });
});

describe('HxCodeEditor in a reactive form', () => {
  let fixture: ComponentFixture<FormHost>;
  let editor: HxCodeEditor;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FormHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    editor = fixture.debugElement.children[0].componentInstance as HxCodeEditor;
  });

  it('writes the control value into the editor', async () => {
    expect(editor.view()!.state.doc.toString()).toBe('start');
    fixture.componentInstance.control.setValue('next');
    fixture.detectChanges();
    expect(editor.view()!.state.doc.toString()).toBe('next');
  });

  it('does not emit valueChange for a write from the control', () => {
    const emitted = vi.fn<() => void>();
    editor.value.subscribe(emitted);
    fixture.componentInstance.control.setValue('quiet');
    fixture.detectChanges();
    expect(editor.view()!.state.doc.toString()).toBe('quiet');
    expect(emitted).not.toHaveBeenCalled();
  });

  it('reports user edits to the control', () => {
    const v = editor.view()!;
    v.dispatch({ changes: { from: 0, insert: '>' } });
    expect(fixture.componentInstance.control.value).toBe('>start');
  });

  it('disables editing with the control', async () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(editor.view()!.state.readOnly).toBe(true);
    expect(editor.view()!.contentDOM.getAttribute('contenteditable')).toBe('false');
  });

  it('names the editor from aria-labelledby', () => {
    expect(editor.view()!.contentDOM.getAttribute('aria-labelledby')).toBe('lbl');
  });
});
