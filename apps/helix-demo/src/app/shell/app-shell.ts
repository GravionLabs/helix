import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import type { HelixStatusBarVersion } from '@gravionlabs/helix-shell';
import { HelixAppLayout, LayoutStore } from '@gravionlabs/helix-shell';
import { HighlightLoader } from 'ngx-highlightjs';
import { DEMO_MENU_MODEL } from './menu.model';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [HelixAppLayout],
  templateUrl: './app-shell.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly store = inject(LayoutStore);
  private readonly highlightLoader = inject(HighlightLoader);

  protected menu = DEMO_MENU_MODEL;

  protected versions: HelixStatusBarVersion[] = [{ label: 'Helix', value: '0.0.0' }];

  // Keep the highlight.js theme in sync with the app's dark mode toggle.
  protected readonly hljsThemeEffect = effect(() => {
    this.highlightLoader.setTheme(
      this.store.isDarkTheme() ? 'hljs-themes/github-dark.min.css' : 'hljs-themes/github.min.css',
    );
  });
}
