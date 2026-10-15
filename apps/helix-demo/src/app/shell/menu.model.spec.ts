import agGridRoutes from '../pages/ag-grid/ag-grid.routes';
import chartsRoutes from '../pages/charts/charts.routes';
import pagesRoutes from '../pages/pages.routes';
import uikitRoutes from '../pages/uikit/uikit.routes';
import { DEMO_MENU_MODEL } from './menu.model';

describe('DEMO_MENU_MODEL charts group', () => {
  const labels = DEMO_MENU_MODEL.map((item) => item.label);

  it('sits after AG Grid and before Pages', () => {
    expect(labels.indexOf('Charts')).toBe(labels.indexOf('AG Grid') + 1);
    expect(labels.indexOf('Pages')).toBe(labels.indexOf('Charts') + 1);
  });

  it('links the Overview item to /charts/overview', () => {
    const charts = DEMO_MENU_MODEL.find((item) => item.label === 'Charts');
    expect(charts?.path).toBe('charts');
    expect(charts?.items?.map((i) => [i.label, i.routerLink])).toEqual([
      ['Overview', ['/charts/overview']],
    ]);
  });

  it('no longer lists Chart under Components', () => {
    const uikit = DEMO_MENU_MODEL.find((item) => item.label === 'Components');
    expect(uikit?.items?.map((i) => i.label)).not.toContain('Chart');
  });
});

describe('charts routes', () => {
  it('serves overview with a breadcrumb and redirects the empty path to it', () => {
    expect(chartsRoutes.find((r) => r.path === 'overview')?.data).toEqual({
      breadcrumb: 'Overview',
    });
    expect(chartsRoutes.find((r) => r.path === '')?.redirectTo).toBe('overview');
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

  it('no longer lists Table under Components or Crud under Pages', () => {
    expect(group('Components')?.items?.map((i) => i.label)).not.toContain('Table');
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

  it('redirects the old uikit/table path to /ag-grid/overview', () => {
    expect(uikitRoutes.find((r) => r.path === 'table')?.redirectTo).toBe('/ag-grid/overview');
    expect(uikitRoutes.some((r) => r.path === 'table' && r.component)).toBe(false);
  });

  it('redirects the old pages/crud path to /ag-grid/crud and pages to empty', () => {
    expect(pagesRoutes.find((r) => r.path === 'crud')?.redirectTo).toBe('/ag-grid/crud');
    expect(pagesRoutes.some((r) => r.path === 'crud' && r.component)).toBe(false);
    expect(pagesRoutes.find((r) => r.path === '')?.redirectTo).toBe('empty');
  });
});
