import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { ButtonDemo } from './buttondemo';
import { ChartDemo } from './chartdemo';
import { FileDemo } from './filedemo';
import { FormLayoutDemo } from './formlayoutdemo';
import { InputDemo } from './inputdemo';
import { ListDemo } from './listdemo';
import { MediaDemo } from './mediademo';
import { MenuDemo } from './menudemo';
import { MessagesDemo } from './messagesdemo';
import { MiscDemo } from './miscdemo';
import { OverlayDemo } from './overlaydemo';
import { PanelsDemo } from './panelsdemo';
import { TableDemo } from './tabledemo';
import { TimelineDemo } from './timelinedemo';
import { TreeDemo } from './treedemo';
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
  tree: TreeDemo,
};

export default [
  ...UIKIT_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
  })),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
