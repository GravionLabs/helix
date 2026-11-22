import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { ElementRef } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { Annotation, Compartment, type Extension, EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers as lineNumbersExtension } from '@codemirror/view';
import { HX_CODE_LANGUAGES, hxLoadLanguage } from '../language/language';
import { hxCodeHighlight } from '../theme/code-highlight';
import { hxCodeTheme } from '../theme/code-theme';

/** Marks a transaction that comes from the `value` binding, so it is not reported as a user edit. */
const external = Annotation.define<boolean>();

/**
 * A CodeMirror editor in an Angular template: text in and out, the language chosen by file path,
 * the Helix theme and highlighting by default, and `extensions` for the app's own features.
 * A real form control for template-driven, reactive and signal forms.
 *
 * ```html
 * <hx-code-editor aria-label="Source" path="app.ts" [(value)]="text" />
 * <hx-code-editor aria-label="Config" path="a.json" [formControl]="control" />
 * ```
 *
 * `valueChange` fires on user edits only. Every other input reconfigures the running view; the
 * view is created once and destroyed with the component. Give the editor an accessible name with
 * `aria-label` or `aria-labelledby` on the host.
 */
@Component({
  selector: 'hx-code-editor',
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxCodeEditor), multi: true },
  ],
  host: {
    class: 'hx-code-editor',
    '[class.hx-code-editor-invalid]': 'invalid()',
    '[class.hx-code-editor-disabled]': 'isDisabled()',
    // The name moves to the editable element; the host is not the control.
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '(focusout)': 'onFocusOut()',
  },
})
export class HxCodeEditor implements ControlValueAccessor, FormValueControl<string> {
  readonly #languages = inject(HX_CODE_LANGUAGES);

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  /** A file name or path; it selects the language. Empty: plain text. */
  readonly path = input('');
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly lineNumbers = input(true, { transform: booleanAttribute });
  readonly lineWrapping = input(false, { transform: booleanAttribute });
  /** Extra CodeMirror extensions of the app (completion, search, linting, …). */
  readonly extensions = input<readonly Extension[]>([]);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

  readonly #view = signal<EditorView | null>(null);
  /** The `EditorView`, or `null` before the first render. */
  readonly view = this.#view.asReadonly();

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = () => this.disabled() || this.#cvaDisabled();

  readonly #readOnly = new Compartment();
  readonly #lineNumbers = new Compartment();
  readonly #lineWrapping = new Compartment();
  readonly #language = new Compartment();
  readonly #userExtensions = new Compartment();
  readonly #labels = new Compartment();
  #generation = 0;

  #onChange: (value: string) => void = () => {};
  #onTouched: () => void = () => {};

  constructor() {
    afterNextRender(() => {
      const view = new EditorView({
        parent: this.container().nativeElement,
        state: EditorState.create({
          doc: untracked(this.value),
          extensions: [
            hxCodeTheme(),
            hxCodeHighlight(),
            history(),
            keymap.of([...defaultKeymap, ...historyKeymap]),
            this.#readOnly.of(this.#readOnlyExtension()),
            this.#lineNumbers.of(this.lineNumbers() ? lineNumbersExtension() : []),
            this.#lineWrapping.of(this.lineWrapping() ? EditorView.lineWrapping : []),
            this.#language.of([]),
            this.#userExtensions.of([...this.extensions()]),
            this.#labels.of(this.#labelExtension()),
            EditorView.updateListener.of((update) => {
              if (!update.docChanged) return;
              if (update.transactions.some((tr) => tr.annotation(external))) return;
              const text = update.state.doc.toString();
              this.value.set(text);
              this.#onChange(text);
            }),
          ],
        }),
      });
      this.#view.set(view);
    });

    inject(DestroyRef).onDestroy(() => {
      this.#generation++;
      this.#view()?.destroy();
    });

    // The value binding: replace the document in place (scroll position and view are kept).
    effect(() => {
      const value = this.value() ?? '';
      const view = this.#view();
      if (!view || view.state.doc.toString() === value) return;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
        annotations: external.of(true),
      });
    });

    effect(() => {
      const view = this.#view();
      if (!view) return;
      view.dispatch({ effects: this.#readOnly.reconfigure(this.#readOnlyExtension()) });
    });

    effect(() => {
      this.#view()?.dispatch({
        effects: this.#lineNumbers.reconfigure(this.lineNumbers() ? lineNumbersExtension() : []),
      });
    });

    effect(() => {
      this.#view()?.dispatch({
        effects: this.#lineWrapping.reconfigure(this.lineWrapping() ? EditorView.lineWrapping : []),
      });
    });

    effect(() => {
      this.#view()?.dispatch({
        effects: this.#userExtensions.reconfigure([...this.extensions()]),
      });
    });

    effect(() => {
      this.#view()?.dispatch({ effects: this.#labels.reconfigure(this.#labelExtension()) });
    });

    // The language: loaded lazily; a late result of an earlier path is ignored.
    effect(() => {
      const view = this.#view();
      const path = this.path();
      if (!view) return;
      const generation = ++this.#generation;
      void hxLoadLanguage(path, this.#languages).then((support) => {
        if (generation !== this.#generation) return;
        view.dispatch({ effects: this.#language.reconfigure(support ?? []) });
      });
    });
  }

  /** Moves the keyboard focus into the editor. */
  focus(): void {
    this.#view()?.focus();
  }

  #readOnlyExtension(): Extension {
    const locked = this.readOnly() || this.isDisabled();
    return [EditorState.readOnly.of(locked), EditorView.editable.of(!this.isDisabled())];
  }

  #labelExtension(): Extension {
    const attributes: Record<string, string> = {};
    const label = this.ariaLabel();
    const labelledby = this.ariaLabelledby();
    if (label) attributes['aria-label'] = label;
    if (labelledby) attributes['aria-labelledby'] = labelledby;
    return EditorView.contentAttributes.of(attributes);
  }

  protected onFocusOut(): void {
    this.touch.emit();
    this.#onTouched();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }
}
