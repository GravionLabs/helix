import agGridRoutes from '../pages/ag-grid/ag-grid.routes';
import { CellsDemo } from '../pages/ag-grid/cells/cells-demo';
import { Crud } from '../pages/ag-grid/crud/crud';
import { TableDemo } from '../pages/ag-grid/overview/table-demo';
import chartsRoutes from '../pages/charts/charts.routes';
import { CHARTS_MENU_ITEMS } from '../pages/charts/charts-menu-items';
import { LineChartDemo } from '../pages/charts/line/line-chart-demo';
import pagesRoutes from '../pages/pages.routes';
import { DataTableDemo } from '../pages/uikit/data-table/data-table-demo';
import { UikitTableDemo } from '../pages/uikit/table/table-demo';
import uikitRoutes from '../pages/uikit/uikit.routes';
import { DEMO_MENU_MODEL } from './menu.model';

describe('DEMO_MENU_MODEL charts group', () => {
  const labels = DEMO_MENU_MODEL.map((item) => item.label);

  it('sits after AG Grid and before Pages', () => {
    expect(labels.indexOf('Charts')).toBe(labels.indexOf('AG Grid') + 1);
    expect(labels.indexOf('Pages')).toBe(labels.indexOf('Charts') + 1);
  });

  it('links one item per chart type under /charts', () => {
    const charts = DEMO_MENU_MODEL.find((item) => item.label === 'Charts');
    expect(charts?.path).toBe('charts');
    expect(charts?.items?.map((i) => [i.label, i.routerLink])).toEqual([
      ['Line', ['/charts/line']],
      ['Bar', ['/charts/bar']],
      ['Pie & Doughnut', ['/charts/pie']],
      ['Polar Area', ['/charts/polar-area']],
      ['Radar', ['/charts/radar']],
    ]);
  });

  it('no longer lists Chart under Components', () => {
    const uikit = DEMO_MENU_MODEL.find((item) => item.label === 'Components');
    expect(uikit?.items?.map((i) => i.label)).not.toContain('Chart');
  });
});

describe('DEMO_MENU_MODEL Data table item', () => {
  it('lists Data table right after Tree under Components', () => {
    const uikit = DEMO_MENU_MODEL.find((item) => item.label === 'Components');
    const labels = uikit?.items?.map((i) => i.label) ?? [];
    expect(labels.indexOf('Data table')).toBe(labels.indexOf('Tree') + 1);
    const item = uikit?.items?.find((i) => i.label === 'Data table');
    expect(item?.routerLink).toEqual(['/uikit/data-table']);
    expect(item?.icon).toBe('pi pi-fw pi-table');
  });

  it('lists Native table right after Data table under Components, with its own icon', () => {
    const uikit = DEMO_MENU_MODEL.find((item) => item.label === 'Components');
    const labels = uikit?.items?.map((i) => i.label) ?? [];
    expect(labels.indexOf('Native table')).toBe(labels.indexOf('Data table') + 1);
    const item = uikit?.items?.find((i) => i.label === 'Native table');
    expect(item?.routerLink).toEqual(['/uikit/table']);
    expect(item?.icon).toBe('pi pi-fw pi-th-large');
  });

  it('resolves Data table and Table to their own routes', () => {
    const resolve = (path: string) => uikitRoutes.find((r) => r.path === path)?.component;
    expect(resolve('data-table')).toBe(DataTableDemo);
    expect(resolve('table')).toBe(UikitTableDemo);
    expect(resolve('data-table')).not.toBe(resolve('table'));
  });

  it('serves /uikit/data-table with DataTableDemo and a breadcrumb', () => {
    const route = uikitRoutes.find((r) => r.path === 'data-table');
    expect(route?.component).toBe(DataTableDemo);
    expect(route?.data).toEqual({ breadcrumb: 'Data table' });
  });
});

describe('uikit table route', () => {
  it('serves /uikit/table with UikitTableDemo and a breadcrumb instead of redirecting', () => {
    const route = uikitRoutes.find((r) => r.path === 'table');
    expect(route?.component).toBe(UikitTableDemo);
    expect(route?.redirectTo).toBeUndefined();
    expect(route?.data).toEqual({ breadcrumb: 'Native table' });
  });
});

describe('charts routes', () => {
  const pages = chartsRoutes.filter((r) => r.component);

  it('has a component route for every menu item, in menu order', () => {
    expect(pages.map((r) => r.path)).toEqual(CHARTS_MENU_ITEMS.map((i) => i.path));
  });

  it('uses the menu label as breadcrumb', () => {
    expect(pages.map((r) => r.data)).toEqual(
      CHARTS_MENU_ITEMS.map((i) => ({ breadcrumb: i.label })),
    );
  });

  it('lists the chart types with their icons', () => {
    expect(CHARTS_MENU_ITEMS.map((i) => [i.label, i.icon])).toEqual([
      ['Line', 'pi pi-fw pi-chart-line'],
      ['Bar', 'pi pi-fw pi-chart-bar'],
      ['Pie & Doughnut', 'pi pi-fw pi-chart-pie'],
      ['Polar Area', 'pi pi-fw pi-compass'],
      ['Radar', 'pi pi-fw pi-chart-scatter'],
    ]);
  });

  it('redirects the empty path to line', () => {
    expect(chartsRoutes.find((r) => r.path === '')?.redirectTo).toBe('line');
  });

  it('redirects the old uikit/charts path to /charts', () => {
    const old = uikitRoutes.find((r) => r.path === 'charts');
    expect(old?.redirectTo).toBe('/charts');
    expect(uikitRoutes.some((r) => r.path === 'charts' && r.component)).toBe(false);
  });
});

describe('DEMO_MENU_MODEL AG Grid group', () => {
  const group = (label: string) => DEMO_MENU_MODEL.find((item) => item.label === label);

  it('lists the top-level groups in order', () => {
    expect(DEMO_MENU_MODEL.map((item) => item.label)).toEqual([
      'Dashboard',
      'Components',
      'AG Grid',
      'Charts',
      'Pages',
      'Resources',
    ]);
  });

  it('links Overview & theme, Cells and CRUD under /ag-grid', () => {
    const agGrid = group('AG Grid');
    expect(agGrid?.path).toBe('ag-grid');
    expect(agGrid?.icon).toBe('pi pi-fw pi-table');
    expect(agGrid?.breadcrumb).toBe('AG Grid');
    expect(agGrid?.items?.map((i) => [i.label, i.routerLink])).toEqual([
      ['Overview & theme', ['/ag-grid/overview']],
      ['Cells', ['/ag-grid/cells']],
      ['CRUD', ['/ag-grid/crud']],
    ]);
  });

  it('lists Native table under Components and no longer Crud under Pages', () => {
    expect(group('Components')?.items?.map((i) => i.label)).toContain('Native table');
    const pages = group('Pages')?.items?.map((i) => i.label);
    expect(pages).not.toContain('Crud');
    expect(pages).toContain('Empty');
  });
});

describe('ag-grid routes', () => {
  it('serves every page with its menu label as breadcrumb', () => {
    const pages = agGridRoutes.filter((r) => r.component).map((r) => [r.path, r.data]);
    expect(pages).toEqual([
      ['overview', { breadcrumb: 'Overview & theme' }],
      ['cells', { breadcrumb: 'Cells' }],
      ['crud', { breadcrumb: 'CRUD' }],
    ]);
  });

  it('redirects the empty path to overview and unknown paths to /notfound', () => {
    expect(agGridRoutes.find((r) => r.path === '')?.redirectTo).toBe('overview');
    expect(agGridRoutes.find((r) => r.path === '**')?.redirectTo).toBe('/notfound');
  });

  it('redirects the old pages/crud path to /ag-grid/crud and pages to empty', () => {
    expect(pagesRoutes.find((r) => r.path === 'crud')?.redirectTo).toBe('/ag-grid/crud');
    expect(pagesRoutes.some((r) => r.path === 'crud' && r.component)).toBe(false);
    expect(pagesRoutes.find((r) => r.path === '')?.redirectTo).toBe('empty');
  });
});

describe('lazy group routes', () => {
  const group = (label: string) => DEMO_MENU_MODEL.find((item) => item.label === label);

  it('serves each AG Grid page with its own component', () => {
    const component = (path: string) => agGridRoutes.find((r) => r.path === path)?.component;
    expect(component('overview')).toBe(TableDemo);
    expect(component('cells')).toBe(CellsDemo);
    expect(component('crud')).toBe(Crud);
  });

  it('loads the AG Grid routes for the AG Grid group', async () => {
    const loaded = (await group('AG Grid')?.loadChildren?.()) as { default: unknown };
    expect(loaded.default).toBe(agGridRoutes);
  });

  it('loads the charts routes for the Charts group', async () => {
    const loaded = (await group('Charts')?.loadChildren?.()) as { default: unknown };
    expect(loaded.default).toBe(chartsRoutes);
    expect(chartsRoutes.find((r) => r.path === 'line')?.component).toBe(LineChartDemo);
  });
});
