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
import { HxTab, HxTabList, HxTabPanel, HxTabPanels, HxTabs } from '@gravionlabs/helix-ui';
import { Highlight } from 'ngx-highlightjs';

interface SourceTab {
  /** Tab header + hx-tab value. */
  label: string;
  /** File name fetched from `source/{directory}/{file}`. */
  file: string;
  /** highlight.js language. */
  language: string;
}

const LANGUAGES: Record<string, string> = { html: 'xml', scss: 'scss', ts: 'typescript' };

/** The documentation site; a component page is `components/<slug>/`. */
export const DOCS_URL = 'https://gravionlabs.github.io/helix/';

/**
 * Wraps a demo page in tabs: a live demo tab plus one lazily loaded,
 * syntax-highlighted tab per source file. Source files are copied to
 * `public/source/` by `scripts/generate-source-assets.mjs` and fetched at
 * runtime from `source/{directory}/{file}` (relative to the base href, so it
 * works under `/helix/demo/` on GitHub Pages too). The Docs tab links the
 * component pages of the documentation site (`docs`).
 */
@Component({
  selector: 'app-source-tabs',
  standalone: true,
  imports: [HxTabs, HxTabList, HxTab, HxTabPanels, HxTabPanel, Highlight],
  templateUrl: './source-tabs.html',
  styleUrl: './source-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceTabsComponent {
  /** Directory under `source/`, e.g. `dynamicform-advanced`. */
  readonly directory = input.required<string>();
  /** Base file name of the page component, e.g. `dynamic-form-advanced-demo`. */
  readonly componentName = input.required<string>();
  /** Additional files in the same directory, e.g. `['rating-widget.ts']`. */
  readonly extraSources = input<readonly string[]>([]);
  /** Slugs of the component pages of the docs site shown on this page (`button`, `select`). */
  readonly docs = input<readonly string[]>([]);

  protected readonly docsUrl = DOCS_URL;
  protected readonly docLinks = computed(() =>
    this.docs().map((slug) => ({
      slug,
      label: slug.replace(/-/g, ' '),
      url: `${DOCS_URL}components/${slug}/`,
    })),
  );

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
    this.http.get(`source/${this.directory()}/${file}`, { responseType: 'text' }).subscribe({
      next: (content) => this.sources.update((s) => ({ ...s, [file]: content })),
      error: () => this.sources.update((s) => ({ ...s, [file]: null })),
    });
  }
}
