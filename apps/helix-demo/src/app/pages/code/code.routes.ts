import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { CODE_MENU_ITEMS } from './code-menu-items';
import { CodeDiffDemo } from './diff/code-diff-demo';
import { CodeEditorDemo } from './editor/code-editor-demo';
import { CodeLanguageDemo } from './language/code-language-demo';
import { CodeOverviewDemo } from './overview/code-overview-demo';
import { CodeThemeDemo } from './theme/code-theme-demo';

const COMPONENTS: Record<string, Type<unknown>> = {
  overview: CodeOverviewDemo,
  theme: CodeThemeDemo,
  editor: CodeEditorDemo,
  language: CodeLanguageDemo,
  diff: CodeDiffDemo,
};

export default [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ...CODE_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
  })),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
