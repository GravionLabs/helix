import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxCodeEditor } from '@gravionlabs/helix-code';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const SAMPLES: Record<string, string> = {
  'app.ts': "export const greeting: string = 'hello';\n",
  'styles.scss': '.card {\n  color: red;\n}\n',
  'data.json': '{\n  "name": "helix"\n}\n',
};

/** `hx-code-editor`: two-way value, language by file name, read-only and line options. */
@Component({
  selector: 'app-code-editor-demo',
  imports: [HxCodeEditor, SourceTabsComponent],
  templateUrl: './code-editor-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditorDemo {
  protected readonly files = Object.keys(SAMPLES);
  protected readonly path = signal('app.ts');
  protected readonly text = signal(SAMPLES['app.ts']);
  protected readonly readOnly = signal(false);
  protected readonly lineNumbers = signal(true);
  protected readonly lineWrapping = signal(false);

  protected open(file: string): void {
    this.path.set(file);
    this.text.set(SAMPLES[file]);
  }
}
