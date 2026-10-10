import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import type { HelixRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRailItem } from '../nav-rail-item/nav-rail-item';
import type { HelixNavGroup } from './nav-rail.model';

const GROUPS_STORAGE_KEY = 'helix.nav-rail.collapsed-groups';

function readCollapsedGroups(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(GROUPS_STORAGE_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** The items whose label (or whose descendants' label) contains `query`, with their matching children only. */
function filterItems(items: HelixRouteMenuItem[], query: string): HelixRouteMenuItem[] {
  const result: HelixRouteMenuItem[] = [];
  for (const item of items) {
    if (item.label?.toLowerCase().includes(query)) result.push(item);
    else if (item.items?.length) {
      const children = filterItems(item.items, query);
      if (children.length) result.push({ ...item, items: children });
    }
  }
  return result;
}

@Component({
  selector: 'helix-nav-rail',
  standalone: true,
  imports: [CommonModule, HelixNavRailItem, RouterModule],
  templateUrl: './nav-rail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './nav-rail.scss',
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
})
export class HelixNavRail implements OnInit, OnDestroy {
  store = inject(LayoutStore);
  router = inject(Router);
  el = inject(ElementRef);
  private sanitizer = inject(DomSanitizer);

  /** Grouped navigation model. Each group renders an optional uppercase section label. */
  model = input<HelixNavGroup[]>([]);

  /** Application title shown in the brand area. Hidden when nav is collapsed. */
  appTitle = input<string>('Helix');

  /**
   * Brand icon: inline SVG (`<svg>…</svg>`) or URL to an SVG file.
   * Falls back to the default hardcoded icon when not provided.
   */
  brandIcon = input<string>();

  protected isInlineSvg = computed(() => this.brandIcon()?.trim().startsWith('<svg') ?? false);

  protected safeBrandIcon = computed(() => {
    const icon = this.brandIcon();
    if (!icon) return null;
    if (this.isInlineSvg()) {
      return this.sanitizer.bypassSecurityTrustHtml(icon);
    }
    return icon;
  });

  /** The filter field; `Ctrl/Cmd+K` focuses it (and expands a collapsed rail). */
  protected readonly searchField = viewChild<ElementRef<HTMLInputElement>>('search');

  protected readonly query = signal('');
  protected readonly collapsedGroups = signal<string[]>(readCollapsedGroups());
  protected readonly isFiltering = computed(() => this.query().trim().length > 0);

  /** The model the template renders: filtered by the query, sections kept only when something matches. */
  protected readonly visibleModel = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return this.model();
    return this.model()
      .map((group) => ({ ...group, items: filterItems(group.items, query) }))
      .filter((group) => group.items.length > 0);
  });

  protected isGroupCollapsed(group: HelixNavGroup): boolean {
    return !!group.section && !this.isFiltering() && this.collapsedGroups().includes(group.section);
  }

  protected toggleGroup(group: HelixNavGroup): void {
    const name = group.section;
    if (!name) return;
    const current = this.collapsedGroups();
    const next = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
    this.collapsedGroups.set(next);
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable: the state just isn't remembered.
    }
  }

  protected onSearchInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  /** Enter opens the first match, ArrowDown moves into the list, Escape clears the filter. */
  protected onSearchKeydown(event: KeyboardEvent): void {
    const first = () =>
      this.el.nativeElement.querySelector(
        '.helix-nav-rail-nav .helix-nav-rail-link',
      ) as HTMLElement | null;
    if (event.key === 'Enter') {
      event.preventDefault();
      first()?.click();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      first()?.focus();
    } else if (event.key === 'Escape') {
      this.query.set('');
    }
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    if (!this.store.isDesktop() && !this.store.mobileMenuActive()) this.store.onMenuToggle();
    if (this.store.isCollapsed()) this.store.toggleSidebar();
    setTimeout(() => this.searchField()?.nativeElement.focus());
  }

  private outsideClickListener: ((event: MouseEvent) => void) | null = null;
  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      if (this.store.isDesktop()) {
        if (this.store.overlayMenuActive()) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      } else {
        if (this.store.mobileMenuActive()) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      }
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.onRouteChange(navEvent.urlAfterRedirects);
      });
    this.onRouteChange(this.router.url);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.unbindOutsideClickListener();
  }

  private onRouteChange(path: string) {
    this.store.setActivePath(path);
    this.store.closeMobileMenu();
  }

  private bindOutsideClickListener() {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event: MouseEvent) => {
        if (this.isOutsideClicked(event)) {
          this.store.closeMobileMenu();
        }
      };
      document.addEventListener('click', this.outsideClickListener);
    }
  }

  private unbindOutsideClickListener() {
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  private isOutsideClicked(event: MouseEvent): boolean {
    const topbarButtonEl = document.querySelector('.topbar-start > button');
    const railEl = this.el.nativeElement;
    return !(
      railEl?.isSameNode(event.target as Node) ||
      railEl?.contains(event.target as Node) ||
      topbarButtonEl?.isSameNode(event.target as Node) ||
      topbarButtonEl?.contains(event.target as Node)
    );
  }
}
