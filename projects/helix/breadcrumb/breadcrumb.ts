import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, inject, InjectionToken, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuItem, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { Badge } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { ChevronRightIcon, HomeIcon } from '@gravionlabs/helix/icons';
import { TooltipModule } from '@gravionlabs/helix/tooltip';
import { BreadcrumbItemClickEvent, BreadcrumbItemTemplateContext, BreadcrumbPassThrough } from '@gravionlabs/helix/types/breadcrumb';
import { BreadCrumbStyle } from './style/breadcrumbstyle';

const BREADCRUMB_INSTANCE = new InjectionToken<Breadcrumb>('BREADCRUMB_INSTANCE');

/**
 * Breadcrumb provides contextual information about page hierarchy.
 * @group Components
 */
@Component({
    selector: 'h-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, TooltipModule, ChevronRightIcon, HomeIcon, SharedModule, Bind, Badge],
    template: `
        <nav [hBind]="ptm('root')" [class]="cn(cx('root'), styleClass)" [style]="style">
          <ol [class]="cx('list')" [hBind]="ptm('list')">
            @if (home && home.visible !== false) {
              <li [attr.id]="home.id" [class]="cn(cx('homeItem'), home.styleClass)" [ngStyle]="home.style" hTooltip [tooltipOptions]="home.tooltipOptions" [hBind]="ptm('homeItem')" [unstyled]="unstyled()">
                @if (itemTemplate || _itemTemplate) {
                  <ng-template *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: home }"></ng-template>
                } @else {
                  @if (!home.routerLink) {
                    <a
                      [href]="home.url ? home.url : null"
                      [attr.aria-label]="homeAriaLabel"
                      [class]="cn(cx('itemLink'), home.linkClass)"
                      [ngStyle]="home.linkStyle"
                      (click)="onClick($event, home)"
                      [target]="home.target"
                      [attr.title]="home.title"
                      [attr.tabindex]="home.disabled ? null : home.tabindex || '0'"
                      [attr.data-automationid]="home.automationId"
                      [hBind]="ptm('itemLink')"
                      >
                      @if (home.icon) {
                        <span [class]="cn(cx('itemIcon'), home.icon, home.iconClass)" [ngStyle]="home.iconStyle" [hBind]="ptm('itemIcon')"></span>
                      }
                      @if (!home.icon) {
                        <svg data-p-icon="home" [class]="cx('itemIcon')" [hBind]="ptm('itemIcon')" />
                      }
                      @if (home.label) {
                        @if (home.escape !== false) {
                          <span [class]="cn(cx('itemLabel'), home.labelClass)" [ngStyle]="home.labelStyle" [hBind]="ptm('itemLabel')">{{ home.label }}</span>
                        } @else {
                          <span [class]="cn(cx('itemLabel'), home.labelClass)" [ngStyle]="home.labelStyle" [innerHTML]="home.label" [hBind]="ptm('itemLabel')"></span>
                        }
                      }
                      @if (home.badge) {
                        <h-badge [styleClass]="home.badgeStyleClass" [value]="home.badge" [pt]="ptm('pcBadge')" [unstyled]="unstyled()" />
                      }
                    </a>
                  }
                  @if (home.routerLink) {
                    <a
                      [routerLink]="home.routerLink"
                      routerLinkActive="p-menuitem-link-active"
                      [attr.aria-label]="homeAriaLabel"
                      [queryParams]="home.queryParams"
                      [routerLinkActiveOptions]="home.routerLinkActiveOptions || { exact: false }"
                      [class]="cn(cx('itemLink'), home.linkClass)"
                      [ngStyle]="home.linkStyle"
                      (click)="onClick($event, home)"
                      [target]="home.target"
                      [attr.title]="home.title"
                      [attr.tabindex]="home.disabled ? null : home.tabindex || '0'"
                      [attr.data-automationid]="home.automationId"
                      [fragment]="home.fragment"
                      [queryParamsHandling]="home.queryParamsHandling"
                      [preserveFragment]="home.preserveFragment"
                      [skipLocationChange]="home.skipLocationChange"
                      [replaceUrl]="home.replaceUrl"
                      [state]="home.state"
                      [hBind]="ptm('itemLink')"
                      >
                      @if (home.icon) {
                        <span [class]="cn(cx('itemIcon'), home.icon, home.iconClass)" [ngStyle]="home.iconStyle" [hBind]="ptm('itemIcon')"></span>
                      }
                      @if (!home.icon) {
                        <svg data-p-icon="home" [class]="cx('itemIcon')" [hBind]="ptm('itemIcon')" />
                      }
                      @if (home.label) {
                        @if (home.escape !== false) {
                          <span [class]="cn(cx('itemLabel'), home.labelClass)" [ngStyle]="home.labelStyle" [hBind]="ptm('itemLabel')">{{ home.label }}</span>
                        } @else {
                          <span [class]="cn(cx('itemLabel'), home.labelClass)" [ngStyle]="home.labelStyle" [innerHTML]="home.label" [hBind]="ptm('itemLabel')"></span>
                        }
                      }
                      @if (home.badge) {
                        <h-badge [styleClass]="home.badgeStyleClass" [value]="home.badge" [pt]="ptm('pcBadge')" [unstyled]="unstyled()" />
                      }
                    </a>
                  }
                }
              </li>
            }
            @if (model && home) {
              <li [class]="cx('separator')" [hBind]="ptm('separator')">
                @if (!separatorTemplate && !_separatorTemplate) {
                  <svg data-p-icon="chevron-right" [hBind]="ptm('separatorIcon')" />
                }
                <ng-template *ngTemplateOutlet="separatorTemplate || _separatorTemplate"></ng-template>
              </li>
            }
            @for (menuitem of model; track menuitem; let end = $last; let i = $index) {
              @if (menuitem.visible !== false) {
                <li
                  [class]="cn(cx('item', { menuitem }), menuitem.styleClass)"
                  [attr.id]="menuitem.id"
                  [style]="menuitem.style"
                  hTooltip
                  [tooltipOptions]="menuitem.tooltipOptions"
                  [hBind]="getPTOptions(menuitem, i, 'item')"
                  [pTooltipUnstyled]="unstyled()"
                  >
                  @if (itemTemplate || _itemTemplate) {
                    <ng-template *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: menuitem }"></ng-template>
                  } @else {
                    @if (!menuitem?.routerLink) {
                      <a
                        [attr.href]="menuitem?.url ? menuitem?.url : null"
                        [class]="cn(cx('itemLink'), $safeNavigationMigration(menuitem?.linkClass))"
                        [ngStyle]="$safeNavigationMigration(menuitem?.linkStyle)"
                        (click)="onClick($event, menuitem)"
                        [target]="$safeNavigationMigration(menuitem?.target)"
                        [attr.title]="menuitem?.title"
                        [attr.tabindex]="menuitem?.disabled ? null : menuitem?.tabindex || '0'"
                        [attr.data-automationid]="menuitem?.automationId"
                        [hBind]="getPTOptions(menuitem, i, 'itemLink')"
                        >
                        @if (!itemTemplate && !_itemTemplate) {
                          @if (menuitem?.icon) {
                            <span [class]="cn(cx('itemIcon'), $safeNavigationMigration(menuitem?.icon), $safeNavigationMigration(menuitem?.iconClass))" [ngStyle]="$safeNavigationMigration(menuitem?.iconStyle)" [hBind]="getPTOptions(menuitem, i, 'itemIcon')"></span>
                          }
                          @if (menuitem?.label) {
                            @if (menuitem?.escape !== false) {
                              <span [class]="cn(cx('itemLabel'), $safeNavigationMigration(menuitem?.labelClass))" [ngStyle]="$safeNavigationMigration(menuitem?.labelStyle)" [hBind]="getPTOptions(menuitem, i, 'itemLabel')">{{
                                menuitem?.label
                              }}</span>
                            } @else {
                              <span [class]="cn(cx('itemLabel'), $safeNavigationMigration(menuitem?.labelClass))" [ngStyle]="$safeNavigationMigration(menuitem?.labelStyle)" [innerHTML]="$safeNavigationMigration(menuitem?.label)" [hBind]="getPTOptions(menuitem, i, 'itemLabel')"></span
                                >
                              }
                            }
                            @if (menuitem?.badge) {
                              <h-badge [styleClass]="$safeNavigationMigration(menuitem?.badgeStyleClass)" [value]="$safeNavigationMigration(menuitem?.badge)" [pt]="getPTOptions(menuitem, i, 'pcBadge')" [unstyled]="unstyled()" />
                            }
                          }
                        </a>
                      }
                      @if (menuitem?.routerLink) {
                        <a
                          [routerLink]="$safeNavigationMigration(menuitem?.routerLink)"
                          routerLinkActive="p-menuitem-link-active"
                          [queryParams]="$safeNavigationMigration(menuitem?.queryParams)"
                          [routerLinkActiveOptions]="menuitem?.routerLinkActiveOptions || { exact: false }"
                          [class]="cn(cx('itemLink'), $safeNavigationMigration(menuitem?.linkClass))"
                          [ngStyle]="$safeNavigationMigration(menuitem?.linkStyle)"
                          (click)="onClick($event, menuitem)"
                          [target]="$safeNavigationMigration(menuitem?.target)"
                          [attr.title]="menuitem?.title"
                          [attr.tabindex]="menuitem?.disabled ? null : menuitem?.tabindex || '0'"
                          [attr.data-automationid]="menuitem?.automationId"
                          [fragment]="$safeNavigationMigration(menuitem?.fragment)"
                          [queryParamsHandling]="$safeNavigationMigration(menuitem?.queryParamsHandling)"
                          [preserveFragment]="$safeNavigationMigration(menuitem?.preserveFragment)"
                          [skipLocationChange]="$safeNavigationMigration(menuitem?.skipLocationChange)"
                          [replaceUrl]="$safeNavigationMigration(menuitem?.replaceUrl)"
                          [state]="$safeNavigationMigration(menuitem?.state)"
                          [hBind]="getPTOptions(menuitem, i, 'itemLink')"
                          >
                          @if (menuitem?.icon) {
                            <span [class]="cn(cx('itemIcon'), $safeNavigationMigration(menuitem?.icon), $safeNavigationMigration(menuitem?.iconClass))" [ngStyle]="$safeNavigationMigration(menuitem?.iconStyle)" [hBind]="getPTOptions(menuitem, i, 'itemIcon')"></span>
                          }
                          @if (menuitem?.label) {
                            @if (menuitem?.escape !== false) {
                              <span [class]="cn(cx('itemLabel'), $safeNavigationMigration(menuitem?.labelClass))" [ngStyle]="$safeNavigationMigration(menuitem?.labelStyle)" [hBind]="getPTOptions(menuitem, i, 'itemLabel')">{{
                                menuitem?.label
                              }}</span>
                            } @else {
                              <span [class]="cn(cx('itemLabel'), $safeNavigationMigration(menuitem?.labelClass))" [ngStyle]="$safeNavigationMigration(menuitem?.labelStyle)" [innerHTML]="$safeNavigationMigration(menuitem?.label)" [hBind]="getPTOptions(menuitem, i, 'itemLabel')"></span
                                >
                              }
                            }
                            @if (menuitem?.badge) {
                              <h-badge [styleClass]="$safeNavigationMigration(menuitem?.badgeStyleClass)" [value]="$safeNavigationMigration(menuitem?.badge)" [pt]="getPTOptions(menuitem, i, 'pcBadge')" [unstyled]="unstyled()" />
                            }
                          </a>
                        }
                      }
                    </li>
                  }
                  @if (!end && menuitem.visible !== false) {
                    <li [class]="cx('separator')" [hBind]="ptm('separator')">
                      @if (!separatorTemplate && !_separatorTemplate) {
                        <svg data-p-icon="chevron-right" [hBind]="ptm('separatorIcon')" />
                      }
                      <ng-template *ngTemplateOutlet="separatorTemplate || _separatorTemplate"></ng-template>
                    </li>
                  }
                }
              </ol>
            </nav>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BreadCrumbStyle, { provide: BREADCRUMB_INSTANCE, useExisting: Breadcrumb }, { provide: PARENT_INSTANCE, useExisting: Breadcrumb }],
    hostDirectives: [Bind]
})
export class Breadcrumb extends BaseComponent<BreadcrumbPassThrough> {
    componentName = 'Breadcrumb';

    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * An array of menuitems.
     * @group Props
     */
    @Input() model: MenuItem[] | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * MenuItem configuration for the home icon.
     * @group Props
     */
    @Input() home: MenuItem | undefined;
    /**
     * Defines a string that labels the home icon for accessibility.
     * @group Props
     */
    @Input() homeAriaLabel: string | undefined;
    /**
     * Fired when an item is selected.
     * @param {BreadcrumbItemClickEvent} event - custom click event.
     * @group Emits
     */
    @Output() onItemClick: EventEmitter<BreadcrumbItemClickEvent> = new EventEmitter<BreadcrumbItemClickEvent>();

    _componentStyle = inject(BreadCrumbStyle);

    router = inject(Router);

    onClick(event: MouseEvent, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }

        this.onItemClick.emit({
            originalEvent: event,
            item: item
        });
    }

    /**
     * Custom item template.
     * @group Templates
     */
    @ContentChild('item') itemTemplate: TemplateRef<BreadcrumbItemTemplateContext> | undefined;

    /**
     * Custom separator template.
     * @group Templates
     */
    @ContentChild('separator') separatorTemplate: TemplateRef<void> | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    _separatorTemplate: TemplateRef<void> | undefined;

    _itemTemplate: TemplateRef<BreadcrumbItemTemplateContext> | undefined;

    onAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'separator':
                    this._separatorTemplate = item.template;
                    break;

                case 'item':
                    this._itemTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    getPTOptions(item: MenuItem, index: number, key: string) {
        return this.ptm(key, {
            context: {
                item,
                index
            }
        });
    }
}

@NgModule({
    imports: [Breadcrumb, SharedModule],
    exports: [Breadcrumb, SharedModule]
})
export class BreadcrumbModule {}
