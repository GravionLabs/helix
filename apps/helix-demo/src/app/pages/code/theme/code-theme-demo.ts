import type { ElementRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { hxCodeHighlight, hxCodeTheme } from '@gravionlabs/helix-code';
import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const SAMPLE = `// A small example
export interface User {
  id: number;
  name: string;
}

/** Greets a user. */
export function greet(user: User): string {
  const text = \`Hello \${user.name}\`;
  return user.id > 0 ? text : 'unknown';
}
`;

/** `hxCodeTheme()` and `hxCodeHighlight()` on an editor; it follows the light and dark theme with no rebuild. */
@Component({
  selector: 'app-code-theme-demo',
  imports: [SourceTabsComponent],
  templateUrl: './code-theme-demo.html',
  styleUrl: './code-theme-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeThemeDemo {
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('editor');
  private view?: EditorView;

  constructor() {
    const language = new Compartment();
    afterNextRender(() => {
      this.view = new EditorView({
        parent: this.host().nativeElement,
        state: EditorState.create({
          doc: SAMPLE,
          extensions: [lineNumbers(), hxCodeTheme(), hxCodeHighlight(), language.of([])],
        }),
      });
      const view = this.view;
      void LanguageDescription.matchFilename(languages, 'demo.ts')
        ?.load()
        .then((support) => view.dispatch({ effects: language.reconfigure(support) }));
    });
    inject(DestroyRef).onDestroy(() => this.view?.destroy());
  }
}
