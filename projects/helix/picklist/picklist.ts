import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  model,
  NgModule,
  numberAttribute,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  input
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { find, findIndexInList, isEmpty, setAttribute, uuid } from '@primeuix/utils';
import { FilterService, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { ButtonModule, ButtonProps } from '@gravionlabs/helix/button';
import { AngleDoubleDownIcon, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleDoubleUpIcon, AngleDownIcon, AngleLeftIcon, AngleRightIcon, AngleUpIcon } from '@gravionlabs/helix/icons';
import { Listbox, ListboxChangeEvent } from '@gravionlabs/helix/listbox';
import { Ripple } from '@gravionlabs/helix/ripple';
import { Nullable, VoidListener } from '@gravionlabs/helix/ts-helpers';
import {
    PickListFilterOptions,
    PickListFilterTemplateContext,
    PickListItemTemplateContext,
    PickListMoveAllToSourceEvent,
    PickListMoveAllToTargetEvent,
    PickListMoveToSourceEvent,
    PickListMoveToTargetEvent,
    PickListSourceFilterEvent,
    PickListSourceReorderEvent,
    PickListSourceSelectEvent,
    PickListTargetFilterEvent,
    PickListTargetReorderEvent,
    PickListTargetSelectEvent,
    PickListTransferIconTemplateContext
} from '@gravionlabs/helix/types/picklist';
import { PickListStyle } from './style/pickliststyle';

const PICKLIST_INSTANCE = new InjectionToken<PickList>('PICKLIST_INSTANCE');

/**
 * PickList is used to reorder items between different lists.
 * @group Components
 */
@Component({
    selector: 'h-pickList, h-picklist, h-pick-list',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        Ripple,
        DragDropModule,
        AngleDoubleDownIcon,
        AngleDoubleLeftIcon,
        AngleDoubleRightIcon,
        AngleDoubleUpIcon,
        AngleDownIcon,
        AngleLeftIcon,
        AngleRightIcon,
        AngleUpIcon,
        Listbox,
        FormsModule,
        SharedModule,
        BindModule
    ],
    templateUrl: './picklist.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [PickListStyle, { provide: PARENT_INSTANCE, useExisting: PickList }, { provide: PICKLIST_INSTANCE, useExisting: PickList }],
    hostDirectives: [Bind]
})
export class PickList extends BaseComponent {
    componentName = 'PickList';

    readonly hostName = input<any>('');

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcPickList: PickList | undefined = inject(PICKLIST_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }
    /**
     * An array of objects for the source list.
     * @group Props
     */
    source = model<any[]>([]);
    /**
     * An array of objects for the target list.
     * @group Props
     */
    target = model<any[]>([]);
    /**
     * Name of the field that uniquely identifies the options.
     * @group Props
     */
    readonly dataKey = input<string>();
    /**
     * Text for the source list caption
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() sourceHeader: string | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Defines a string that labels the move to right button for accessibility.
     * @group Props
     */
    readonly rightButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the move to left button for accessibility.
     * @group Props
     */
    readonly leftButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the move to all right button for accessibility.
     * @group Props
     */
    readonly allRightButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the move to all left button for accessibility.
     * @group Props
     */
    readonly allLeftButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the move to up button for accessibility.
     * @group Props
     */
    readonly upButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the move to down button for accessibility.
     * @group Props
     */
    readonly downButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the move to top button for accessibility.
     * @group Props
     */
    readonly topButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the move to bottom button for accessibility.
     * @group Props
     */
    readonly bottomButtonAriaLabel = input<string>();
    /**
     * Defines a string that labels the source list.
     * @group Props
     */
    readonly sourceAriaLabel = input<string>();
    /**
     * Defines a string that labels the target list.
     * @group Props
     */
    readonly targetAriaLabel = input<string>();
    /**
     * Text for the target list caption
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() targetHeader: string | undefined;
    /**
     * When enabled orderlist adjusts its controls based on screen size.
     * @group Props
     */
    readonly responsive = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When specified displays an input field to filter the items on keyup and decides which field to search (Accepts multiple fields with a comma).
     * @group Props
     */
    readonly filterBy = input<string>();
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. Use sourceTrackBy or targetTrackBy in case different algorithms are needed per list.
     * @group Props
     */
    readonly trackBy = input<Function>((index: number, item: any) => item);
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in source list, default algorithm checks for object identity.
     * @group Props
     */
    readonly sourceTrackBy = input<Function>();
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in target list, default algorithm checks for object identity.
     * @group Props
     */
    readonly targetTrackBy = input<Function>();
    /**
     * Whether to show filter input for source list when filterBy is enabled.
     * @group Props
     */
    readonly showSourceFilter = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show filter input for target list when filterBy is enabled.
     * @group Props
     */
    readonly showTargetFilter = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    readonly dragdrop = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Inline style of the source list element.
     * @group Props
     */
    readonly sourceStyle = input<any>();
    /**
     * Inline style of the target list element.
     * @group Props
     */
    readonly targetStyle = input<any>();
    /**
     * Whether to show buttons of source list.
     * @group Props
     */
    readonly showSourceControls = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show buttons of target list.
     * @group Props
     */
    readonly showTargetControls = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Placeholder text on source filter input.
     * @group Props
     */
    readonly sourceFilterPlaceholder = input<string>();
    /**
     * Placeholder text on target filter input.
     * @group Props
     */
    readonly targetFilterPlaceholder = input<string>();
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(undefined!, { transform: booleanAttribute });

    /**
     * Name of the disabled field of a target option or function to determine disabled state.
     * @group Props
     */
    readonly sourceOptionDisabled = input<string | ((item: any) => boolean)>();

    /**
     * Name of the disabled field of a target option or function to determine disabled state.
     * @group Props
     */
    readonly targetOptionDisabled = input<string | ((item: any) => boolean)>();

    /**
     * Defines a string that labels the filter input of source list.
     * @group Props
     */
    readonly ariaSourceFilterLabel = input<string>();
    /**
     * Defines a string that labels the filter input of target list.
     * @group Props
     */
    readonly ariaTargetFilterLabel = input<string>();
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    readonly filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | string>('contains');
    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     */
    readonly stripedRows = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Keeps selection on the transfer list.
     * @group Props
     */
    readonly keepSelection = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input<string>('14rem');
    /**
     * Whether to focus on the first visible or selected element.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>({ severity: 'secondary' });
    /**
     * Used to pass all properties of the ButtonProps to the move up button inside the component.
     * @group Props
     */
    readonly moveUpButtonProps = input<ButtonProps>();
    /**
     * 	Used to pass all properties of the ButtonProps to the move top button inside the component.
     * @group Props
     */
    readonly moveTopButtonProps = input<ButtonProps>();
    /**
     * 	Used to pass all properties of the ButtonProps to the move down button inside the component.
     * @group Props
     */
    readonly moveDownButtonProps = input<ButtonProps>();
    /**
     * 	Used to pass all properties of the ButtonProps to the move bottom button inside the component.
     * @group Props
     */
    readonly moveBottomButtonProps = input<ButtonProps>();
    /**
     * 	Used to pass all properties of the ButtonProps to the move to target button inside the component.
     * @group Props
     */
    readonly moveToTargetProps = input<ButtonProps>();
    /**
     * 	Used to pass all properties of the ButtonProps to the move all to target button inside the component.
     * @group Props
     */
    readonly moveAllToTargetProps = input<ButtonProps>();
    /**
     *  Used to pass all properties of the ButtonProps to the move to source button inside the component.
     * @group Props
     */
    readonly moveToSourceProps = input<ButtonProps>();
    /**
     *  Used to pass all properties of the ButtonProps to the move all to source button inside the component.
     * @group Props
     */
    readonly moveAllToSourceProps = input<ButtonProps>();

    /**
     * Indicates the width of the screen at which the component should change its behavior.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get breakpoint(): string {
        return this._breakpoint;
    }
    set breakpoint(value: string) {
        if (value !== this._breakpoint) {
            this._breakpoint = value;
            if (isPlatformBrowser(this.platformId)) {
                this.destroyMedia();
                this.initMedia();
            }
        }
    }
    /**
     * Callback to invoke when items are moved from target to source.
     * @param {PickListMoveToSourceEvent} event - Custom move to source event.
     * @group Emits
     */
    @Output() onMoveToSource: EventEmitter<PickListMoveToSourceEvent> = new EventEmitter<PickListMoveToSourceEvent>();
    /**
     * Callback to invoke when all items are moved from target to source.
     * @param {PickListMoveAllToSourceEvent} event - Custom move all to source event.
     * @group Emits
     */
    @Output() onMoveAllToSource: EventEmitter<PickListMoveAllToSourceEvent> = new EventEmitter<PickListMoveAllToSourceEvent>();
    /**
     * Callback to invoke when all items are moved from source to target.
     * @param {PickListMoveAllToTargetEvent} event - Custom move all to target event.
     * @group Emits
     */
    @Output() onMoveAllToTarget: EventEmitter<PickListMoveAllToTargetEvent> = new EventEmitter<PickListMoveAllToTargetEvent>();
    /**
     * Callback to invoke when items are moved from source to target.
     * @param {PickListMoveToTargetEvent} event - Custom move to target event.
     * @group Emits
     */
    @Output() onMoveToTarget: EventEmitter<PickListMoveToTargetEvent> = new EventEmitter<PickListMoveToTargetEvent>();
    /**
     * Callback to invoke when items are reordered within source list.
     * @param {PickListSourceReorderEvent} event - Custom source reorder event.
     * @group Emits
     */
    @Output() onSourceReorder: EventEmitter<PickListSourceReorderEvent> = new EventEmitter<PickListSourceReorderEvent>();
    /**
     * Callback to invoke when items are reordered within target list.
     * @param {PickListTargetReorderEvent} event - Custom target reorder event.
     * @group Emits
     */
    @Output() onTargetReorder: EventEmitter<PickListTargetReorderEvent> = new EventEmitter<PickListTargetReorderEvent>();
    /**
     * Callback to invoke when items are selected within source list.
     * @param {PickListSourceSelectEvent} event - Custom source select event.
     * @group Emits
     */
    @Output() onSourceSelect: EventEmitter<PickListSourceSelectEvent> = new EventEmitter<PickListSourceSelectEvent>();
    /**
     * Callback to invoke when items are selected within target list.
     * @param {PickListTargetSelectEvent} event - Custom target select event.
     * @group Emits
     */
    @Output() onTargetSelect: EventEmitter<PickListTargetSelectEvent> = new EventEmitter<PickListTargetSelectEvent>();
    /**
     * Callback to invoke when the source list is filtered
     * @param {PickListSourceFilterEvent} event - Custom source filter event.
     * @group Emits
     */
    @Output() onSourceFilter: EventEmitter<PickListSourceFilterEvent> = new EventEmitter<PickListSourceFilterEvent>();
    /**
     * Callback to invoke when the target list is filtered
     * @param {PickListTargetFilterEvent} event - Custom target filter event.
     * @group Emits
     */
    @Output() onTargetFilter: EventEmitter<PickListTargetFilterEvent> = new EventEmitter<PickListTargetFilterEvent>();

    /**
     * Callback to invoke when the list is focused
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onFocus: EventEmitter<Event> = new EventEmitter<Event>();

    /**
     * Callback to invoke when the list is blurred
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @ViewChild('sourcelist') listViewSourceChild: Listbox;

    @ViewChild('targetlist') listViewTargetChild: Listbox;

    @ViewChild('sourceFilter') sourceFilterViewChild: Nullable<ElementRef>;

    @ViewChild('targetFilter') targetFilterViewChild: Nullable<ElementRef>;

    getButtonProps(direction: string) {
        switch (direction) {
            case 'moveup':
                return { ...this.buttonProps(), ...this.moveUpButtonProps() };
            case 'movetop':
                return { ...this.buttonProps(), ...this.moveTopButtonProps() };
            case 'movedown':
                return { ...this.buttonProps(), ...this.moveDownButtonProps() };
            case 'movebottom':
                return { ...this.buttonProps(), ...this.moveBottomButtonProps() };
            case 'movetotarget':
                return { ...this.buttonProps(), ...this.moveToTargetProps() };
            case 'movealltotarget':
                return { ...this.buttonProps(), ...this.moveAllToTargetProps() };
            case 'movetosource':
                return { ...this.buttonProps(), ...this.moveToSourceProps() };
            case 'movealltosource':
                return { ...this.buttonProps(), ...this.moveAllToSourceProps() };
            default:
                return this.buttonProps();
        }
    }

    get targetOptions() {
        return [...(this.target() || [])];
    }

    get sourceOptions() {
        return [...(this.source() || [])];
    }

    get moveUpAriaLabel() {
        const upButtonAriaLabel = this.upButtonAriaLabel();
        return upButtonAriaLabel ? upButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveUp : undefined;
    }

    get moveTopAriaLabel() {
        const topButtonAriaLabel = this.topButtonAriaLabel();
        return topButtonAriaLabel ? topButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveTop : undefined;
    }

    get moveDownAriaLabel() {
        const downButtonAriaLabel = this.downButtonAriaLabel();
        return downButtonAriaLabel ? downButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveBottomAriaLabel() {
        const bottomButtonAriaLabel = this.bottomButtonAriaLabel();
        return bottomButtonAriaLabel ? bottomButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveToTargetAriaLabel() {
        const rightButtonAriaLabel = this.rightButtonAriaLabel();
        return rightButtonAriaLabel ? rightButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveToTarget : undefined;
    }

    get moveAllToTargetAriaLabel() {
        const allRightButtonAriaLabel = this.allRightButtonAriaLabel();
        return allRightButtonAriaLabel ? allRightButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveAllToTarget : undefined;
    }

    get moveToSourceAriaLabel() {
        const leftButtonAriaLabel = this.leftButtonAriaLabel();
        return leftButtonAriaLabel ? leftButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveToSource : undefined;
    }

    get moveAllToSourceAriaLabel() {
        const allLeftButtonAriaLabel = this.allLeftButtonAriaLabel();
        return allLeftButtonAriaLabel ? allLeftButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveAllToSource : undefined;
    }

    get idSource() {
        return this.id + '_source';
    }

    get idTarget() {
        return this.id + '_target';
    }

    _breakpoint: string = '960px';

    public visibleOptionsSource: any[] | undefined | null;

    public visibleOptionsTarget: any[] | undefined | null;

    selectedItemsSource: any[] = [];

    selectedItemsTarget: any[] = [];

    reorderedListElement: any;

    movedUp: Nullable<boolean>;

    movedDown: Nullable<boolean>;

    itemTouched: Nullable<boolean>;

    styleElement: any;

    id: string = uuid('pn_id_');

    filterValueSource: Nullable<string>;

    filterValueTarget: Nullable<string>;

    fromListType: Nullable<number>;

    sourceFilterOptions: Nullable<PickListFilterOptions>;

    targetFilterOptions: Nullable<PickListFilterOptions>;

    readonly SOURCE_LIST: number = -1;

    readonly TARGET_LIST: number = 1;

    window: Window;

    media: MediaQueryList | null | undefined;

    viewChanged: boolean | undefined;

    _componentStyle = inject(PickListStyle);

    mediaChangeListener: VoidListener;

    filterService = inject(FilterService);

    onInit() {
        if (this.responsive()) {
            this.createStyle();
            this.initMedia();
        }

        if (this.filterBy()) {
            this.sourceFilterOptions = {
                filter: (value) => this.filterSource(value),
                reset: () => this.resetSourceFilter()
            };

            this.targetFilterOptions = {
                filter: (value) => this.filterTarget(value),
                reset: () => this.resetTargetFilter()
            };
        }
    }

    /**
     * Custom item template.
     * @param {PickListItemTemplateContext} context - item context.
     * @see {@link PickListItemTemplateContext}
     * @group Templates
     */
    @ContentChild('item', { descendants: false }) itemTemplate: TemplateRef<PickListItemTemplateContext>;

    /**
     * Custom source header template.
     * @group Templates
     */
    @ContentChild('sourceHeader', { descendants: false }) sourceHeaderTemplate: TemplateRef<void>;

    /**
     * Custom target header template.
     * @group Templates
     */
    @ContentChild('targetHeader', { descendants: false }) targetHeaderTemplate: TemplateRef<void>;

    /**
     * Custom source filter template.
     * @param {PickListFilterTemplateContext} context - filter context.
     * @see {@link PickListFilterTemplateContext}
     * @group Templates
     */
    @ContentChild('sourceFilter', { descendants: false }) sourceFilterTemplate: TemplateRef<PickListFilterTemplateContext>;

    /**
     * Custom target filter template.
     * @param {PickListFilterTemplateContext} context - filter context.
     * @see {@link PickListFilterTemplateContext}
     * @group Templates
     */
    @ContentChild('targetFilter', { descendants: false }) targetFilterTemplate: TemplateRef<PickListFilterTemplateContext>;

    /**
     * Custom empty message when source is empty template.
     * @group Templates
     */
    @ContentChild('emptymessagesource', { descendants: false }) emptyMessageSourceTemplate: TemplateRef<void>;

    /**
     * Custom empty filter message when source is empty template.
     * @group Templates
     */
    @ContentChild('emptyfiltermessagesource', { descendants: false }) emptyFilterMessageSourceTemplate: TemplateRef<void>;

    /**
     * Custom empty message when target is empty template.
     * @group Templates
     */
    @ContentChild('emptymessagetarget', { descendants: false }) emptyMessageTargetTemplate: TemplateRef<void>;

    /**
     * Custom empty filter message when target is empty template.
     * @group Templates
     */
    @ContentChild('emptyfiltermessagetarget', { descendants: false }) emptyFilterMessageTargetTemplate: TemplateRef<void>;

    /**
     * Custom move up icon template.
     * @group Templates
     */
    @ContentChild('moveupicon', { descendants: false }) moveUpIconTemplate: TemplateRef<void>;

    /**
     * Custom move top icon template.
     * @group Templates
     */
    @ContentChild('movetopicon', { descendants: false }) moveTopIconTemplate: TemplateRef<void>;

    /**
     * Custom move down icon template.
     * @group Templates
     */
    @ContentChild('movedownicon', { descendants: false }) moveDownIconTemplate: TemplateRef<void>;

    /**
     * Custom move bottom icon template.
     * @group Templates
     */
    @ContentChild('movebottomicon', { descendants: false }) moveBottomIconTemplate: TemplateRef<void>;

    /**
     * Custom move to target icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    @ContentChild('movetotargeticon', { descendants: false }) moveToTargetIconTemplate: TemplateRef<PickListTransferIconTemplateContext>;

    /**
     * Custom move all to target icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    @ContentChild('movealltotargeticon', { descendants: false }) moveAllToTargetIconTemplate: TemplateRef<PickListTransferIconTemplateContext>;

    /**
     * Custom move to source icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    @ContentChild('movetosourceicon', { descendants: false }) moveToSourceIconTemplate: TemplateRef<PickListTransferIconTemplateContext>;

    /**
     * Custom move all to source icon template.
     * @param {PickListTransferIconTemplateContext} context - icon context.
     * @see {@link PickListTransferIconTemplateContext}
     * @group Templates
     */
    @ContentChild('movealltosourceicon', { descendants: false }) moveAllToSourceIconTemplate: TemplateRef<PickListTransferIconTemplateContext>;

    /**
     * Custom target filter icon template.
     * @group Templates
     */
    @ContentChild('targetfiltericon', { descendants: false }) targetFilterIconTemplate: TemplateRef<void>;

    /**
     * Custom source filter icon template.
     * @group Templates
     */
    @ContentChild('sourcefiltericon', { descendants: false }) sourceFilterIconTemplate: TemplateRef<void>;

    @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

    _itemTemplate: TemplateRef<PickListItemTemplateContext> | undefined;

    _sourceHeaderTemplate: TemplateRef<void> | undefined;

    _targetHeaderTemplate: TemplateRef<void> | undefined;

    _sourceFilterTemplate: TemplateRef<PickListFilterTemplateContext> | undefined;

    _targetFilterTemplate: TemplateRef<PickListFilterTemplateContext> | undefined;

    _emptyMessageSourceTemplate: TemplateRef<void> | undefined;

    _emptyFilterMessageSourceTemplate: TemplateRef<void> | undefined;

    _emptyMessageTargetTemplate: TemplateRef<void> | undefined;

    _emptyFilterMessageTargetTemplate: TemplateRef<void> | undefined;

    _moveUpIconTemplate: TemplateRef<void> | undefined;

    _moveTopIconTemplate: TemplateRef<void> | undefined;

    _moveDownIconTemplate: TemplateRef<void> | undefined;

    _moveBottomIconTemplate: TemplateRef<void> | undefined;

    _moveToTargetIconTemplate: TemplateRef<PickListTransferIconTemplateContext> | undefined;

    _moveAllToTargetIconTemplate: TemplateRef<PickListTransferIconTemplateContext> | undefined;

    _moveToSourceIconTemplate: TemplateRef<PickListTransferIconTemplateContext> | undefined;

    _moveAllToSourceIconTemplate: TemplateRef<PickListTransferIconTemplateContext> | undefined;

    _targetFilterIconTemplate: TemplateRef<void> | undefined;

    _sourceFilterIconTemplate: TemplateRef<void> | undefined;

    onAfterContentInit() {
        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this._itemTemplate = item.template;
                    break;

                case 'option':
                    this._itemTemplate = item.template;
                    break;

                case 'sourceHeader':
                    this._sourceHeaderTemplate = item.template;
                    break;

                case 'targetHeader':
                    this._targetHeaderTemplate = item.template;
                    break;

                case 'sourceFilter':
                    this._sourceFilterTemplate = item.template;
                    break;

                case 'targetFilter':
                    this._targetFilterTemplate = item.template;
                    break;

                case 'emptymessagesource':
                    this._emptyMessageSourceTemplate = item.template;
                    break;

                case 'emptyfiltermessagesource':
                    this._emptyFilterMessageSourceTemplate = item.template;
                    break;

                case 'emptymessagetarget':
                    this._emptyMessageTargetTemplate = item.template;
                    break;

                case 'emptyfiltermessagetarget':
                    this._emptyFilterMessageTargetTemplate = item.template;
                    break;

                case 'moveupicon':
                    this._moveUpIconTemplate = item.template;
                    break;

                case 'movetopicon':
                    this._moveTopIconTemplate = item.template;
                    break;

                case 'movedownicon':
                    this._moveDownIconTemplate = item.template;
                    break;

                case 'movebottomicon':
                    this._moveBottomIconTemplate = item.template;
                    break;

                case 'movetotargeticon':
                    this._moveToTargetIconTemplate = item.template;
                    break;

                case 'movealltotargeticon':
                    this._moveAllToTargetIconTemplate = item.template;
                    break;

                case 'movetosourceicon':
                    this._moveToSourceIconTemplate = item.template;
                    break;

                case 'movealltosourceicon':
                    this._moveAllToSourceIconTemplate = item.template;
                    break;

                case 'targetfiltericon':
                    this._targetFilterIconTemplate = item.template;
                    break;

                case 'sourcefiltericon':
                    this._sourceFilterIconTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    onChangeSelection(e: ListboxChangeEvent, listType: number) {
        this.setSelectionList(listType, e.value);
        const callback = listType === this.SOURCE_LIST ? this.onSourceSelect : this.onTargetSelect;

        callback.emit({ originalEvent: e.originalEvent, items: e.value });
    }

    onSourceItemDblClick() {
        if (this.disabled()) {
            return;
        }

        this.moveRight();
        this.triggerChangeDetection();
    }

    onTargetItemDblClick() {
        if (this.disabled()) {
            return;
        }

        this.moveLeft();
        this.triggerChangeDetection();
    }

    onFilter(event: KeyboardEvent, listType: number) {
        let query = (<HTMLInputElement>event.target).value;
        if (listType === this.SOURCE_LIST) this.filterSource(query);
        else if (listType === this.TARGET_LIST) this.filterTarget(query);
    }

    filterSource(value: any = '') {
        this.filterValueSource = value.trim().toLocaleLowerCase(this.filterLocale());
        this.filter(<any[]>this.source(), this.SOURCE_LIST);
        this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
    }

    filterTarget(value: any = '') {
        this.filterValueTarget = value.trim().toLocaleLowerCase(this.filterLocale());
        this.filter(<any[]>this.target(), this.TARGET_LIST);
        this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
    }

    filter(data: any[], listType: number) {
        let searchFields = (<string>this.filterBy()).split(',');

        if (listType === this.SOURCE_LIST) {
            this.visibleOptionsSource = this.filterService.filter(data, searchFields, this.filterValueSource, this.filterMatchMode(), this.filterLocale());
            this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
        } else if (listType === this.TARGET_LIST) {
            this.visibleOptionsTarget = this.filterService.filter(data, searchFields, this.filterValueTarget, this.filterMatchMode(), this.filterLocale());
            this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
        }
    }

    isItemVisible(item: any, listType: number): boolean | undefined {
        if (listType == this.SOURCE_LIST) return this.isVisibleInList(<any[]>this.visibleOptionsSource, item, <string>this.filterValueSource);
        else return this.isVisibleInList(<any[]>this.visibleOptionsTarget, item, <string>this.filterValueTarget);
    }

    isEmpty(listType: number) {
        if (listType == this.SOURCE_LIST) return this.filterValueSource ? !this.visibleOptionsSource || this.visibleOptionsSource.length === 0 : !this.source() || this.source().length === 0;
        else return this.filterValueTarget ? !this.visibleOptionsTarget || this.visibleOptionsTarget.length === 0 : !this.target() || this.target().length === 0;
    }

    isVisibleInList(data: any[], item: any, filterValue: string): boolean | undefined {
        if (filterValue && filterValue.trim().length) {
            for (let i = 0; i < data.length; i++) {
                if (item == data[i]) {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    onItemTouchEnd() {
        if (this.disabled()) {
            return;
        }

        this.itemTouched = true;
    }

    private sortByIndexInList(items: any[], list: any) {
        return items.sort((item1, item2) => findIndexInList(item1, list) - findIndexInList(item2, list));
    }

    triggerChangeDetection() {
        this.listViewTargetChild.cd.markForCheck();
        this.listViewSourceChild.cd.markForCheck();
    }

    moveUp(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != 0) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex - 1];
                    list[selectedItemIndex - 1] = movedItem;
                    list[selectedItemIndex] = temp;
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            this.movedUp = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveTop(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != 0) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.unshift(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            listElement.scrollTop = 0;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveDown(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex + 1];
                    list[selectedItemIndex + 1] = movedItem;
                    list[selectedItemIndex] = temp;
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            this.movedDown = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveBottom(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.push(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop() && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            listElement.scrollTop = listElement.scrollHeight;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveRight() {
        if (this.selectedItemsSource && this.selectedItemsSource.length) {
            let itemsToMove = [...this.selectedItemsSource];
            for (let i = 0; i < itemsToMove.length; i++) {
                let selectedItem = itemsToMove[i];
                if (findIndexInList(selectedItem, this.target() || []) == -1) {
                    this.target()?.push(this.source()?.splice(findIndexInList(selectedItem, this.source()), 1)[0]);

                    if (this.visibleOptionsSource?.includes(selectedItem)) {
                        this.visibleOptionsSource.splice(findIndexInList(selectedItem, this.visibleOptionsSource), 1);
                    }
                }
            }

            this.onMoveToTarget.emit({
                items: itemsToMove
            });

            if (this.keepSelection()) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...itemsToMove];
            }

            itemsToMove = [];
            this.selectedItemsSource = [];

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target(), this.TARGET_LIST);
            }
            this.triggerChangeDetection();
        }
    }

    moveAllRight() {
        if (this.source()) {
            let movedItems: any = [];

            for (let i = 0; i < this.source().length; i++) {
                if (this.isItemVisible(this.source()[i], this.SOURCE_LIST)) {
                    let removedItem = this.source().splice(i, 1)[0];
                    this.target().push(removedItem);

                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveAllToTarget.emit({
                items: movedItems
            });
            if (this.keepSelection()) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...this.selectedItemsSource];
            }
            this.selectedItemsSource = [];

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target(), this.TARGET_LIST);
            }

            this.visibleOptionsSource = [];
            this.triggerChangeDetection();
        }
    }

    moveLeft() {
        if (this.selectedItemsTarget && this.selectedItemsTarget.length) {
            let itemsToMove = [...this.selectedItemsTarget];
            for (let i = 0; i < itemsToMove.length; i++) {
                let selectedItem = itemsToMove[i];
                if (findIndexInList(selectedItem, this.source() || []) == -1) {
                    this.source()?.push(this.target()?.splice(findIndexInList(selectedItem, this.target()), 1)[0]);

                    if (this.visibleOptionsTarget?.includes(selectedItem)) {
                        this.visibleOptionsTarget.splice(findIndexInList(selectedItem, this.visibleOptionsTarget), 1)[0];
                    }
                }
            }
            this.onMoveToSource.emit({
                items: itemsToMove
            });
            if (this.keepSelection()) {
                this.selectedItemsSource = [...this.selectedItemsSource, itemsToMove];
            }
            itemsToMove = [];
            this.selectedItemsTarget = [];

            if (this.filterValueSource) {
                this.filter(<any[]>this.source(), this.SOURCE_LIST);
            }
            this.triggerChangeDetection();
        }
    }

    moveAllLeft() {
        if (this.target()) {
            let movedItems: any = [];

            for (let i = 0; i < this.target().length; i++) {
                if (this.isItemVisible(this.target()[i], this.TARGET_LIST)) {
                    let removedItem = this.target().splice(i, 1)[0];
                    this.source().push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveAllToSource.emit({
                items: movedItems
            });
            if (this.keepSelection()) {
                this.selectedItemsSource = [...this.selectedItemsSource, ...this.selectedItemsTarget];
            }
            this.selectedItemsTarget = [];

            if (this.filterValueSource) {
                this.filter(<any[]>this.source(), this.SOURCE_LIST);
            }

            this.visibleOptionsTarget = [];
            this.triggerChangeDetection();
        }
    }

    isSelected(item: any, selectedItems: any[]) {
        return this.findIndexInList(item, selectedItems) != -1;
    }

    findIndexInList(item: any, selectedItems: any[]): number {
        return findIndexInList(item, selectedItems);
    }

    onDrop(event: CdkDragDrop<string[]>, listType: number) {
        let isTransfer = event.previousContainer !== event.container;

        let dropIndexes = this.getDropIndexes(event.previousIndex, event.currentIndex, listType, isTransfer, event.item.data);

        if (listType === this.SOURCE_LIST) {
            if (isTransfer) {
                // Moving from target to source
                let itemsToMove: any[] = [];

                // Check if dragged item is in selected items
                if (this.selectedItemsTarget && this.selectedItemsTarget.length > 0 && findIndexInList(event.item.data, this.selectedItemsTarget) !== -1) {
                    // Move all selected items
                    itemsToMove = [...this.selectedItemsTarget];
                } else {
                    // Move only the dragged item
                    itemsToMove = [event.item.data];
                }

                // Sort items by their index in target (to maintain order)
                const sortedItems = this.sortByIndexInList(itemsToMove, this.target() || []);

                // Remove all items from target
                for (let item of sortedItems) {
                    const itemIndex = findIndexInList(item, this.target() || []);
                    if (itemIndex !== -1) {
                        this.target()?.splice(itemIndex, 1);
                    }
                }

                // Add all items to source at the drop position
                for (let i = 0; i < sortedItems.length; i++) {
                    this.source()?.splice(dropIndexes.currentIndex + i, 0, sortedItems[i]);
                }

                // Clear target selection
                this.selectedItemsTarget = [];

                if (this.keepSelection()) {
                    this.selectedItemsSource = [...this.selectedItemsSource, ...itemsToMove];
                }

                if (this.visibleOptionsTarget) {
                    // Update visible options
                    for (let item of itemsToMove) {
                        const visibleIndex = findIndexInList(item, this.visibleOptionsTarget);
                        if (visibleIndex !== -1) {
                            this.visibleOptionsTarget.splice(visibleIndex, 1);
                        }
                    }
                }

                this.onMoveToSource.emit({ items: itemsToMove });
            } else {
                if (this.source()) {
                    moveItemInArray(this.source(), dropIndexes.previousIndex, dropIndexes.currentIndex);
                }
                this.onSourceReorder.emit({ items: [event.item.data] });
            }

            if (this.filterValueSource) {
                this.filter(<any[]>this.source(), this.SOURCE_LIST);
            }
        } else {
            if (isTransfer) {
                // Moving from source to target
                let itemsToMove: any[] = [];

                // Check if dragged item is in selected items
                if (this.selectedItemsSource && this.selectedItemsSource.length > 0 && findIndexInList(event.item.data, this.selectedItemsSource) !== -1) {
                    // Move all selected items
                    itemsToMove = [...this.selectedItemsSource];
                } else {
                    // Move only the dragged item
                    itemsToMove = [event.item.data];
                }

                // Sort items by their index in source (to maintain order)
                const sortedItems = this.sortByIndexInList(itemsToMove, this.source() || []);

                // Remove all items from source
                for (let item of sortedItems) {
                    const itemIndex = findIndexInList(item, this.source() || []);
                    if (itemIndex !== -1) {
                        this.source()?.splice(itemIndex, 1);
                    }
                }

                // Add all items to target at the drop position
                for (let i = 0; i < sortedItems.length; i++) {
                    this.target()?.splice(dropIndexes.currentIndex + i, 0, sortedItems[i]);
                }

                // Clear source selection
                this.selectedItemsSource = [];

                if (this.keepSelection()) {
                    this.selectedItemsTarget = [...this.selectedItemsTarget, ...itemsToMove];
                }

                if (this.visibleOptionsSource) {
                    // Update visible options
                    for (let item of itemsToMove) {
                        const visibleIndex = findIndexInList(item, this.visibleOptionsSource);
                        if (visibleIndex !== -1) {
                            this.visibleOptionsSource.splice(visibleIndex, 1);
                        }
                    }
                }

                this.onMoveToTarget.emit({ items: itemsToMove });
            } else {
                if (this.target()) {
                    moveItemInArray(this.target(), dropIndexes.previousIndex, dropIndexes.currentIndex);
                }
                this.onTargetReorder.emit({ items: [event.item.data] });
            }

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target(), this.TARGET_LIST);
            }
        }

        // Only trigger change detection for transfers, not reordering
        // Reordering modifies arrays in-place and triggerChangeDetection() would override changes
        if (isTransfer) {
            this.triggerChangeDetection();
        }
        this.cd.markForCheck();
    }

    onListFocus(event, listType) {
        this.onFocus.emit(event);
    }

    onListBlur(event, listType) {
        this.onBlur.emit(event);
    }

    getListElement(listType: number) {
        return listType === this.SOURCE_LIST ? this.listViewSourceChild?.el.nativeElement : this.listViewTargetChild?.el.nativeElement;
    }

    getListItems(listType: number) {
        let listElemet = this.getListElement(listType);

        return find(listElemet, 'li.p-picklist-item');
    }

    getLatestSelectedVisibleOptionIndex(visibleList: any[], selectedItems: any[]): number {
        const latestSelectedItem = [...selectedItems].reverse().find((item) => visibleList.includes(item));
        return latestSelectedItem !== undefined ? visibleList.indexOf(latestSelectedItem) : -1;
    }

    getVisibleList(listType: number) {
        if (listType === this.SOURCE_LIST) {
            return this.visibleOptionsSource && this.visibleOptionsSource.length > 0 ? this.visibleOptionsSource : this.source() && this.source().length > 0 ? this.source() : null;
        }

        return this.visibleOptionsTarget && this.visibleOptionsTarget.length > 0 ? this.visibleOptionsTarget : this.target() && this.target().length > 0 ? this.target() : null;
    }

    setSelectionList(listType: number, selectedItems: any[]) {
        if (listType === this.SOURCE_LIST) {
            this.selectedItemsSource = selectedItems;
        } else {
            this.selectedItemsTarget = selectedItems;
        }
    }

    getDropIndexes(fromIndex: number, toIndex: number, droppedList: number, isTransfer: boolean, data: any[] | any) {
        let previousIndex, currentIndex;

        if (droppedList === this.SOURCE_LIST) {
            previousIndex = isTransfer ? (this.filterValueTarget ? findIndexInList(data, this.target() || []) : fromIndex) : this.filterValueSource ? findIndexInList(data, this.source() || []) : fromIndex;
            currentIndex = this.filterValueSource ? this.findFilteredCurrentIndex(this.visibleOptionsSource || [], toIndex, this.source() || []) : toIndex;
        } else {
            previousIndex = isTransfer ? (this.filterValueSource ? findIndexInList(data, this.source() || []) : fromIndex) : this.filterValueTarget ? findIndexInList(data, this.target() || []) : fromIndex;
            currentIndex = this.filterValueTarget ? this.findFilteredCurrentIndex(this.visibleOptionsTarget || [], toIndex, this.target() || []) : toIndex;
        }

        return { previousIndex, currentIndex };
    }

    findFilteredCurrentIndex(visibleOptions: any[], index: number, options: any) {
        if (visibleOptions.length === index) {
            let toIndex = findIndexInList(visibleOptions[index - 1], options);

            return toIndex + 1;
        } else {
            return findIndexInList(visibleOptions[index], options);
        }
    }

    resetSourceFilter() {
        this.visibleOptionsSource = null;
        this.filterValueSource = null;
        this.sourceFilterViewChild && ((<HTMLInputElement>this.sourceFilterViewChild.nativeElement).value = '');
    }

    resetTargetFilter() {
        this.visibleOptionsTarget = null;
        this.filterValueTarget = null;
        this.targetFilterViewChild && ((<HTMLInputElement>this.targetFilterViewChild.nativeElement).value = '');
    }

    resetFilter() {
        this.resetSourceFilter();
        this.resetTargetFilter();
    }

    initMedia() {
        if (isPlatformBrowser(this.platformId)) {
            this.media = this.document.defaultView?.matchMedia(`(max-width: ${this.breakpoint})`) || null;
            this.viewChanged = this.media?.matches || false;
            this.bindMediaChangeListener();
        }
    }

    destroyMedia() {
        this.unbindMediaChangeListener();
    }

    bindMediaChangeListener() {
        if (this.media && !this.mediaChangeListener) {
            this.mediaChangeListener = this.renderer.listen(this.media, 'change', (event) => {
                this.viewChanged = event.matches;

                this.cd.markForCheck();
            });
        }
    }

    unbindMediaChangeListener() {
        if (this.mediaChangeListener) {
            this.mediaChangeListener();
            this.mediaChangeListener = null;
        }
    }

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement) {
                this.renderer.setAttribute(this.el.nativeElement.children[0], this.id, '');
                this.styleElement = this.renderer.createElement('style');
                this.renderer.setAttribute(this.styleElement, 'type', 'text/css');
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.styleElement);

                let innerHTML = `
                @media screen and (max-width: ${this.breakpoint}) {
                    .p-picklist[${this.id}] {
                        flex-direction: column;
                    }

                    .p-picklist[${this.id}] .p-picklist-controls {
                        flex-direction: row;
                    }
                }`;

                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    sourceMoveDisabled() {
        if (this.disabled() || !this.selectedItemsSource.length) {
            return true;
        }
    }

    targetMoveDisabled() {
        if (this.disabled() || !this.selectedItemsTarget.length) {
            return true;
        }
    }

    moveRightDisabled() {
        return this.disabled() || isEmpty(this.selectedItemsSource);
    }

    moveLeftDisabled() {
        return this.disabled() || isEmpty(this.selectedItemsTarget);
    }

    moveAllRightDisabled() {
        return this.disabled() || isEmpty(this.source());
    }

    moveAllLeftDisabled() {
        return this.disabled() || isEmpty(this.target());
    }

    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
            ``;
        }
    }

    onDestroy() {
        this.destroyStyle();
        this.destroyMedia();
    }
}

@NgModule({
    imports: [PickList, SharedModule],
    exports: [PickList, SharedModule]
})
export class PickListModule {}
