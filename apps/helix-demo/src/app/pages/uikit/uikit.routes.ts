import type { EnvironmentProviders, Provider, Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { provideHelixDynamicForms } from '@gravionlabs/helix-zod';
import { ButtonDemo } from './button/button-demo';
import { ChartDemo } from './charts/chart-demo';
import { DynamicFormDemo } from './dynamicform/dynamic-form-demo';
import { advancedErrorResolver } from './dynamicform-advanced/advanced-error-resolver';
import { DynamicFormAdvancedDemo } from './dynamicform-advanced/dynamic-form-advanced-demo';
import { RatingWidget } from './dynamicform-advanced/rating-widget';
import { DynamicFormJsonDemo } from './dynamicform-json/dynamic-form-json-demo';
import { FileDemo } from './file/file-demo';
import { FormLayoutDemo } from './formlayout/form-layout-demo';
import { InputDemo } from './input/input-demo';
import { ListDemo } from './list/list-demo';
import { MediaDemo } from './media/media-demo';
import { MenuDemo } from './menu/menu-demo';
import { MessagesDemo } from './message/messages-demo';
import { MiscDemo } from './misc/misc-demo';
import { OverlayDemo } from './overlay/overlay-demo';
import { PanelsDemo } from './panel/panels-demo';
import { TableDemo } from './table/table-demo';
import { TimelineDemo } from './timeline/timeline-demo';
import { TopbarDemo } from './topbar/topbar-demo';
import { TreeDemo } from './tree/tree-demo';
import { UIKIT_MENU_ITEMS } from './uikit-menu-items';

const COMPONENTS: Record<string, Type<unknown>> = {
  button: ButtonDemo,
  charts: ChartDemo,
  dynamicform: DynamicFormDemo,
  'dynamicform-advanced': DynamicFormAdvancedDemo,
  'dynamicform-json': DynamicFormJsonDemo,
  file: FileDemo,
  formlayout: FormLayoutDemo,
  input: InputDemo,
  list: ListDemo,
  media: MediaDemo,
  menu: MenuDemo,
  message: MessagesDemo,
  misc: MiscDemo,
  overlay: OverlayDemo,
  panel: PanelsDemo,
  table: TableDemo,
  timeline: TimelineDemo,
  topbar: TopbarDemo,
  tree: TreeDemo,
};

// Route-scoped providers — each route gets its own environment injector, so
// the two dynamic-form pages keep isolated widget registries and resolvers.
const PROVIDERS: Record<string, (Provider | EnvironmentProviders)[]> = {
  dynamicform: [provideHelixDynamicForms()],
  'dynamicform-advanced': [
    provideHelixDynamicForms({
      widgets: [{ widget: 'rating', component: RatingWidget }],
      errorMessageResolver: advancedErrorResolver,
    }),
  ],
  'dynamicform-json': [provideHelixDynamicForms()],
};

export default [
  { path: '', redirectTo: 'formlayout', pathMatch: 'full' },
  ...UIKIT_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
    providers: PROVIDERS[item.path!] ?? [],
  })),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
