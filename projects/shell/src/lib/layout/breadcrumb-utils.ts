import type { ActivatedRoute } from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';

export function helixBreadcrumbsFromRoutes(route: ActivatedRoute): HxMenuItem[] {
  let deepest: ActivatedRoute | null = route;
  while (deepest.firstChild) {
    deepest = deepest.firstChild;
  }

  const breadcrumbs: HxMenuItem[] = [];
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

/** The title of the deepest active route: its `title` (static or resolved) or `data['title']`. */
export function helixPageTitleFromRoutes(route: ActivatedRoute): string | undefined {
  let current: ActivatedRoute | null = route;
  while (current.firstChild) current = current.firstChild;
  for (; current; current = current.parent) {
    const title = current.snapshot.title ?? current.snapshot.data?.['title'];
    if (typeof title === 'string' && title) return title;
  }
  return undefined;
}
