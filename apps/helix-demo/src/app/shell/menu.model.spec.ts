import chartsRoutes from '../pages/charts/charts.routes';
import uikitRoutes from '../pages/uikit/uikit.routes';
import { DEMO_MENU_MODEL } from './menu.model';

describe('DEMO_MENU_MODEL charts group', () => {
  const labels = DEMO_MENU_MODEL.map((item) => item.label);

  it('sits after Components and before Pages', () => {
    expect(labels.indexOf('Charts')).toBe(labels.indexOf('Components') + 1);
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
