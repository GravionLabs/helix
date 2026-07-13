import type { ActivatedRoute } from '@angular/router';
import type { MenuItem } from '@gravionlabs/helix/api';

export function helixBreadcrumbsFromRoutes(route: ActivatedRoute): MenuItem[] {
  let deepest: ActivatedRoute | null = route;
  while (deepest.firstChild) {
    deepest = deepest.firstChild;
  }

  const breadcrumbs: MenuItem[] = [];
  const routePath: { url: string; snapshot: typeof route.snapshot }[] = [];

  let current: ActivatedRoute | null = deepest;
  while (current) {
    const url = current.snapshot.url.map((s) => s.path).join('/');
    routePath.push({ url, snapshot: current.snapshot });
    current = current.parent;
  }

  let accumulatedUrl = '';
  for (const { url, snapshot } of routePath.reverse()) {
    if (url) {
      accumulatedUrl = accumulatedUrl ? `${accumulatedUrl}/${url}` : url;
    }

    const breadcrumb = snapshot.data?.['breadcrumb'];
    if (!breadcrumb) continue;

    const label = typeof breadcrumb === 'function' ? breadcrumb(snapshot) : breadcrumb;

    if (accumulatedUrl) {
      breadcrumbs.push({ label, routerLink: `/${accumulatedUrl}` });
    } else {
      breadcrumbs.push({ label });
    }
  }

  return breadcrumbs;
}
