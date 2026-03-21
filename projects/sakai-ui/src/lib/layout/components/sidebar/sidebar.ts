import { Component, effect, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { LayoutStore } from '../../store/layout.store';
import { GV_MENU_MODEL } from '../../menu-model.token';
import { GvMenu } from '../menu/menu';

@Component({
    selector: 'gv-sidebar',
    standalone: true,
    imports: [GvMenu, RouterModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class GvSidebar implements OnInit, OnDestroy {
    store = inject(LayoutStore);
    router = inject(Router);
    el = inject(ElementRef);
    menuModel = inject(GV_MENU_MODEL);

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
            .pipe(filter((event) => event instanceof NavigationEnd), takeUntil(this.destroy$))
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
        const sidebarEl = this.el.nativeElement;
        return !(
            sidebarEl?.isSameNode(event.target as Node) ||
            sidebarEl?.contains(event.target as Node) ||
            topbarButtonEl?.isSameNode(event.target as Node) ||
            topbarButtonEl?.contains(event.target as Node)
        );
    }
}
