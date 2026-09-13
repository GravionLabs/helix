import type { ElementRef, TemplateRef } from '@angular/core';
import type { OverlayOptions, PassThroughOptions, Translation } from '@gravionlabs/helix-core/api';
import type { AccordionPassThrough } from '@gravionlabs/helix-core/types/accordion';
import type { AutoCompletePassThrough } from '@gravionlabs/helix-core/types/autocomplete';
import type { AvatarPassThrough } from '@gravionlabs/helix-core/types/avatar';
import type { AvatarGroupPassThrough } from '@gravionlabs/helix-core/types/avatargroup';
import type { BadgePassThrough } from '@gravionlabs/helix-core/types/badge';
import type { BlockUIPassThrough } from '@gravionlabs/helix-core/types/blockui';
import type { BreadcrumbPassThrough } from '@gravionlabs/helix-core/types/breadcrumb';
import type { ButtonPassThrough } from '@gravionlabs/helix-core/types/button';
import type { CardPassThrough } from '@gravionlabs/helix-core/types/card';
import type { CarouselPassThrough } from '@gravionlabs/helix-core/types/carousel';
import type { CascadeSelectPassThrough } from '@gravionlabs/helix-core/types/cascadeselect';
import type { CheckboxPassThrough } from '@gravionlabs/helix-core/types/checkbox';
import type { ChipPassThrough } from '@gravionlabs/helix-core/types/chip';
import type { ColorPickerPassThrough } from '@gravionlabs/helix-core/types/colorpicker';
import type { ConfirmDialogPassThrough } from '@gravionlabs/helix-core/types/confirmdialog';
import type { ConfirmPopupPassThrough } from '@gravionlabs/helix-core/types/confirmpopup';
import type { DialogPassThrough } from '@gravionlabs/helix-core/types/dialog';
import type { DividerPassThrough } from '@gravionlabs/helix-core/types/divider';
import type { DockPassThrough } from '@gravionlabs/helix-core/types/dock';
import type { DrawerPassThrough } from '@gravionlabs/helix-core/types/drawer';
import type { EditorPassThrough } from '@gravionlabs/helix-core/types/editor';
import type { FieldsetPassThrough } from '@gravionlabs/helix-core/types/fieldset';
import type { FileUploadPassThrough } from '@gravionlabs/helix-core/types/fileupload';
import type { FloatLabelPassThrough } from '@gravionlabs/helix-core/types/floatlabel';
import type { FluidPassThrough } from '@gravionlabs/helix-core/types/fluid';
import type { GalleriaPassThrough } from '@gravionlabs/helix-core/types/galleria';
import type { IconFieldPassThrough } from '@gravionlabs/helix-core/types/iconfield';
import type { IftaLabelPassThrough } from '@gravionlabs/helix-core/types/iftalabel';
import type { ImagePassThrough } from '@gravionlabs/helix-core/types/image';
import type { ImageComparePassThrough } from '@gravionlabs/helix-core/types/imagecompare';
import type { InplacePassThrough } from '@gravionlabs/helix-core/types/inplace';
import type { InputGroupPassThrough } from '@gravionlabs/helix-core/types/inputgroup';
import type { InputGroupAddonPassThrough } from '@gravionlabs/helix-core/types/inputgroupaddon';
import type { InputIconPassThrough } from '@gravionlabs/helix-core/types/inputicon';
import type { InputMaskPassThrough } from '@gravionlabs/helix-core/types/inputmask';
import type { InputNumberPassThrough } from '@gravionlabs/helix-core/types/inputnumber';
import type { InputOtpPassThrough } from '@gravionlabs/helix-core/types/inputotp';
import type { InputTextPassThrough } from '@gravionlabs/helix-core/types/inputtext';
import type { KnobPassThrough } from '@gravionlabs/helix-core/types/knob';
import type { MegaMenuPassThrough } from '@gravionlabs/helix-core/types/megamenu';
import type { MenuPassThrough } from '@gravionlabs/helix-core/types/menu';
import type { MenubarPassThrough } from '@gravionlabs/helix-core/types/menubar';
import type { MessagePassThrough } from '@gravionlabs/helix-core/types/message';
import type { MeterGroupPassThrough } from '@gravionlabs/helix-core/types/metergroup';
import type { OrderListPassThrough } from '@gravionlabs/helix-core/types/orderlist';
import type { OrganizationChartPassThrough } from '@gravionlabs/helix-core/types/organizationchart';
import type { OverlayBadgePassThrough } from '@gravionlabs/helix-core/types/overlaybadge';
import type { PanelPassThrough } from '@gravionlabs/helix-core/types/panel';
import type { PanelMenuPassThrough } from '@gravionlabs/helix-core/types/panelmenu';
import type { PopoverPassThrough } from '@gravionlabs/helix-core/types/popover';
import type { ProgressBarPassThrough } from '@gravionlabs/helix-core/types/progressbar';
import type { ProgressSpinnerPassThrough } from '@gravionlabs/helix-core/types/progressspinner';
import type { RadioButtonPassThrough } from '@gravionlabs/helix-core/types/radiobutton';
import type { RatingPassThrough } from '@gravionlabs/helix-core/types/rating';
import type { VirtualScrollerPassThrough } from '@gravionlabs/helix-core/types/scroller';
import type { ScrollPanelPassThrough } from '@gravionlabs/helix-core/types/scrollpanel';
import type { ScrollTopPassThrough } from '@gravionlabs/helix-core/types/scrolltop';
import type { SelectPassThrough } from '@gravionlabs/helix-core/types/select';
import type { SelectButtonPassThrough } from '@gravionlabs/helix-core/types/selectbutton';
import type { SkeletonPassThrough } from '@gravionlabs/helix-core/types/skeleton';
import type { SliderPassThrough } from '@gravionlabs/helix-core/types/slider';
import type { SpeedDialPassThrough } from '@gravionlabs/helix-core/types/speeddial';
import type { SplitButtonPassThrough } from '@gravionlabs/helix-core/types/splitbutton';
import type { SplitterPassThrough } from '@gravionlabs/helix-core/types/splitter';
import type { StepperPassThrough } from '@gravionlabs/helix-core/types/stepper';
import type { ColumnFilterPassThrough, TablePassThrough } from '@gravionlabs/helix-core/types/table';
import type { TabListPassThrough, TabPanelPassThrough, TabPanelsPassThrough, TabPassThrough, TabsPassThrough } from '@gravionlabs/helix-core/types/tabs';
import type { TagPassThrough } from '@gravionlabs/helix-core/types/tag';
import type { TerminalPassThrough } from '@gravionlabs/helix-core/types/terminal';
import type { TieredMenuPassThrough } from '@gravionlabs/helix-core/types/tieredmenu';
import type { TimelinePassThrough } from '@gravionlabs/helix-core/types/timeline';
import type { ToastPassThrough } from '@gravionlabs/helix-core/types/toast';
import type { ToggleButtonPassThrough } from '@gravionlabs/helix-core/types/togglebutton';
import type { ToggleSwitchPassThrough } from '@gravionlabs/helix-core/types/toggleswitch';
import type { ToolbarPassThrough } from '@gravionlabs/helix-core/types/toolbar';
import type { TreePassThrough } from '@gravionlabs/helix-core/types/tree';
import type { TreeSelectPassThrough } from '@gravionlabs/helix-core/types/treeselect';
import type { TreeTablePassThrough } from '@gravionlabs/helix-core/types/treetable';

/** ZIndex configuration */
export type ZIndex = {
    modal: number;
    overlay: number;
    menu: number;
    tooltip: number;
};

/** Theme configuration */
export type ThemeType = { preset?: any; options?: any } | 'none' | boolean | undefined;

export type ThemeConfigType = {
    theme?: ThemeType;
    csp?: {
        nonce: string | undefined;
    };
};

export interface GlobalPassThrough {
    accordion?: AccordionPassThrough;
    autoComplete?: AutoCompletePassThrough;
    avatar?: AvatarPassThrough;
    avatarGroup?: AvatarGroupPassThrough;
    blockUI?: BlockUIPassThrough;
    breadcrumb?: BreadcrumbPassThrough;
    card?: CardPassThrough;
    carousel?: CarouselPassThrough;
    cascadeSelect?: CascadeSelectPassThrough;
    checkbox?: CheckboxPassThrough;
    chip?: ChipPassThrough;
    colorPicker?: ColorPickerPassThrough;
    columnFilter?: ColumnFilterPassThrough;
    confirmDialog?: ConfirmDialogPassThrough;
    confirmPopup?: ConfirmPopupPassThrough;
    dialog?: DialogPassThrough;
    divider?: DividerPassThrough;
    dock?: DockPassThrough;
    megaMenu?: MegaMenuPassThrough;
    drawer?: DrawerPassThrough;
    editor?: EditorPassThrough;
    fileUpload?: FileUploadPassThrough;
    floatLabel?: FloatLabelPassThrough;
    menu?: MenuPassThrough;
    menubar?: MenubarPassThrough;
    fluid?: FluidPassThrough;
    galleria?: GalleriaPassThrough;
    iconField?: IconFieldPassThrough;
    iftaLabel?: IftaLabelPassThrough;
    inputIcon?: InputIconPassThrough;
    image?: ImagePassThrough;
    imageCompare?: ImageComparePassThrough;
    inplace?: InplacePassThrough;
    inputText?: InputTextPassThrough;
    inputGroup?: InputGroupPassThrough;
    inputGroupAddon?: InputGroupAddonPassThrough;
    inputMask?: InputMaskPassThrough;
    inputNumber?: InputNumberPassThrough;
    inputOtp?: InputOtpPassThrough;
    knob?: KnobPassThrough;
    popover?: PopoverPassThrough;
    message?: MessagePassThrough;
    meterGroup?: MeterGroupPassThrough;
    orderList?: OrderListPassThrough;
    organizationChart?: OrganizationChartPassThrough;
    overlayBadge?: OverlayBadgePassThrough;
    progressBar?: ProgressBarPassThrough;
    progressSpinner?: ProgressSpinnerPassThrough;
    radioButton?: RadioButtonPassThrough;
    rating?: RatingPassThrough;
    virtualScroller?: VirtualScrollerPassThrough;
    scrollPanel?: ScrollPanelPassThrough;
    scrollTop?: ScrollTopPassThrough;
    select?: SelectPassThrough;
    selectButton?: SelectButtonPassThrough;
    skeleton?: SkeletonPassThrough;
    slider?: SliderPassThrough;
    speedDial?: SpeedDialPassThrough;
    splitButton?: SplitButtonPassThrough;
    splitter?: SplitterPassThrough;
    stepper?: StepperPassThrough;
    tabs?: TabsPassThrough;
    tab?: TabPassThrough;
    tabList?: TabListPassThrough;
    tabPanel?: TabPanelPassThrough;
    tabPanels?: TabPanelsPassThrough;
    table?: TablePassThrough;
    tieredMenu?: TieredMenuPassThrough;
    timeline?: TimelinePassThrough;
    tag?: TagPassThrough;
    terminal?: TerminalPassThrough;
    toast?: ToastPassThrough;
    toggleButton?: ToggleButtonPassThrough;
    toggleSwitch?: ToggleSwitchPassThrough;
    toolbar?: ToolbarPassThrough;
    tree?: TreePassThrough;
    treeSelect?: TreeSelectPassThrough;
    treeTable?: TreeTablePassThrough;
    panel?: PanelPassThrough;
    panelMenu?: PanelMenuPassThrough;
    button?: ButtonPassThrough;
    badge?: BadgePassThrough;
    fieldset?: FieldsetPassThrough;
    global?: {
        css?: string;
    };
    [key: string]: any;
}

export type HelixConfigType = {
    ripple?: boolean;
    overlayAppendTo?: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * @deprecated Since v20. Use `inputVariant` instead.
     */
    inputStyle?: 'outlined' | 'filled';
    inputVariant?: 'outlined' | 'filled';
    overlayOptions?: OverlayOptions;
    translation?: Translation;
    /**
     * @experimental
     * This property is not yet implemented. It will be available in a future release.
     */
    unstyled?: boolean;
    zIndex?: ZIndex | null | undefined;
    pt?: GlobalPassThrough | null | undefined;
    ptOptions?: PassThroughOptions | null | undefined;
    filterMatchModeOptions?: any;
} & ThemeConfigType;
