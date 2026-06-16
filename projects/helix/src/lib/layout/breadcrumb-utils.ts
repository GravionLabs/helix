import type { ActivatedRoute } from '@angular/router';
import type { MenuItem } from 'primeng/api';

export function helixBreadcrumbsFromRoutes(route: ActivatedRoute): MenuItem[] {
  const breadcrumbs: MenuItem[] = [];
  const routePath: { url: string; snapshot: typeof route.snapshot }[] = [];

  let current: ActivatedRoute | null = route;
  while (current) {
    const url = current.snapshot.url.map((s) => s.path).join('/');
    routePath.push({ url, snapshot: current.snapshot });
    current = current.parent;
  }

  for (const { url, snapshot } of routePath.reverse()) {
    const breadcrumb = snapshot.data?.['breadcrumb'];
    if (!breadcrumb) continue;

    const label = typeof breadcrumb === 'function' ? breadcrumb(snapshot) : breadcrumb;

    if (url) {
      breadcrumbs.push({ label, routerLink: `/${url}` });
    } else {
      breadcrumbs.push({ label });
    }
  }

  return breadcrumbs;
}
