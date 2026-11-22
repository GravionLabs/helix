import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { hxLanguageFor, hxLoadLanguage } from '@gravionlabs/helix-code';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const FILES = [
  'app.ts',
  'styles.scss',
  'main.rs',
  'Dockerfile',
  'data.json',
  'README',
  'notes.xyz',
];

/** `hxLoadLanguage` for a file name: pick one and see the language, loaded on demand. */
@Component({
  selector: 'app-code-language-demo',
  imports: [SourceTabsComponent],
  templateUrl: './code-language-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeLanguageDemo {
  protected readonly files = FILES;
  protected readonly file = signal('');
  protected readonly result = signal('Pick a file name.');
  private generation = 0;

  protected async pick(file: string): Promise<void> {
    this.file.set(file);
    const generation = ++this.generation;
    const name = hxLanguageFor(file)?.name;
    this.result.set(name ? `Loading ${name}…` : 'No language matches.');
    const support = await hxLoadLanguage(file);
    // A later pick wins over a slow earlier load.
    if (generation !== this.generation) return;
    this.result.set(support ? `Loaded: ${name}` : 'No language matches.');
  }
}
