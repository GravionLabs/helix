import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { ButtonDemo } from './button/button-demo';
import { ChartDemo } from './charts/chart-demo';
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

export default [
  { path: '', redirectTo: 'formlayout', pathMatch: 'full' },
  ...UIKIT_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
  })),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
