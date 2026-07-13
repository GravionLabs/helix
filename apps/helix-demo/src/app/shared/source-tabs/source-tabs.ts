import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { TabsModule } from '@gravionlabs/helix/tabs';
import { Highlight } from 'ngx-highlightjs';

interface SourceTab {
  /** Tab header + p-tab value. */
  label: string;
  /** File name fetched from `/source/{directory}/{file}`. */
  file: string;
  /** highlight.js language. */
  language: string;
}

const LANGUAGES: Record<string, string> = { html: 'xml', scss: 'scss', ts: 'typescript' };

/**
 * Wraps a demo page in tabs: a live demo tab plus one lazily loaded,
 * syntax-highlighted tab per source file. Source files are copied to
 * `public/source/` by `scripts/generate-source-assets.mjs` and fetched at
 * runtime from `/source/{directory}/{file}`.
 */
@Component({
  selector: 'app-source-tabs',
  standalone: true,
  imports: [TabsModule, Highlight],
  templateUrl: './source-tabs.html',
  styleUrl: './source-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceTabsComponent {
  /** Directory under `/source/`, e.g. `dynamicform-advanced`. */
  readonly directory = input.required<string>();
  /** Base file name of the page component, e.g. `dynamic-form-advanced-demo`. */
  readonly componentName = input.required<string>();
  /** Additional files in the same directory, e.g. `['rating-widget.ts']`. */
  readonly extraSources = input<readonly string[]>([]);

  private readonly http = inject(HttpClient);

  protected readonly activeTab = signal<string>('demo');
  /** file name → content; `null` marks a failed fetch (tab hidden). */
  private readonly sources = signal<Record<string, string | null>>({});

  protected readonly tabs = computed<SourceTab[]>(() => {
    const name = this.componentName();
    const main: SourceTab[] = [
      { label: 'HTML', file: `${name}.html`, language: 'xml' },
      { label: 'SCSS', file: `${name}.scss`, language: 'scss' },
      { label: 'TypeScript', file: `${name}.ts`, language: 'typescript' },
    ];
    const extras = this.extraSources().map((file) => ({
      label: file,
      file,
      language: LANGUAGES[file.split('.').pop() ?? ''] ?? 'typescript',
    }));
    // Hide tabs whose fetch failed (e.g. pages without a stylesheet).
    return [...main, ...extras].filter((tab) => this.sources()[tab.file] !== null);
  });

  protected source(file: string): string {
    return this.sources()[file] ?? '';
  }

  constructor() {
    // The SCSS file may not exist (empty stylesheets are not copied) — probe
    // it eagerly so its tab can be hidden; everything else loads lazily.
    effect(() => this.load(`${this.componentName()}.scss`));
    effect(() => {
      const active = this.activeTab();
      if (active !== 'demo' && active !== 'docs') this.load(active);
    });
  }

  private load(file: string): void {
    if (this.sources()[file] !== undefined) return;
    this.http.get(`/source/${this.directory()}/${file}`, { responseType: 'text' }).subscribe({
      next: (content) => this.sources.update((s) => ({ ...s, [file]: content })),
      error: () => this.sources.update((s) => ({ ...s, [file]: null })),
    });
  }
}
