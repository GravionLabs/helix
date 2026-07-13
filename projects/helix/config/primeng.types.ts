import type { ElementRef, TemplateRef } from '@angular/core';
import type { OverlayOptions, PassThroughOptions, Translation } from '@gravionlabs/helix/api';
import type { AccordionPassThrough } from '@gravionlabs/helix/types/accordion';
import type { AutoCompletePassThrough } from '@gravionlabs/helix/types/autocomplete';
import type { AvatarPassThrough } from '@gravionlabs/helix/types/avatar';
import type { AvatarGroupPassThrough } from '@gravionlabs/helix/types/avatargroup';
import type { BadgePassThrough } from '@gravionlabs/helix/types/badge';
import type { BlockUIPassThrough } from '@gravionlabs/helix/types/blockui';
import type { BreadcrumbPassThrough } from '@gravionlabs/helix/types/breadcrumb';
import type { ButtonPassThrough } from '@gravionlabs/helix/types/button';
import type { CardPassThrough } from '@gravionlabs/helix/types/card';
import type { CarouselPassThrough } from '@gravionlabs/helix/types/carousel';
import type { CascadeSelectPassThrough } from '@gravionlabs/helix/types/cascadeselect';
import type { CheckboxPassThrough } from '@gravionlabs/helix/types/checkbox';
import type { ChipPassThrough } from '@gravionlabs/helix/types/chip';
import type { ColorPickerPassThrough } from '@gravionlabs/helix/types/colorpicker';
import type { ConfirmDialogPassThrough } from '@gravionlabs/helix/types/confirmdialog';
import type { ConfirmPopupPassThrough } from '@gravionlabs/helix/types/confirmpopup';
import type { DialogPassThrough } from '@gravionlabs/helix/types/dialog';
import type { DividerPassThrough } from '@gravionlabs/helix/types/divider';
import type { DockPassThrough } from '@gravionlabs/helix/types/dock';
import type { DrawerPassThrough } from '@gravionlabs/helix/types/drawer';
import type { EditorPassThrough } from '@gravionlabs/helix/types/editor';
import type { FieldsetPassThrough } from '@gravionlabs/helix/types/fieldset';
import type { FileUploadPassThrough } from '@gravionlabs/helix/types/fileupload';
import type { FloatLabelPassThrough } from '@gravionlabs/helix/types/floatlabel';
import type { FluidPassThrough } from '@gravionlabs/helix/types/fluid';
import type { GalleriaPassThrough } from '@gravionlabs/helix/types/galleria';
import type { IconFieldPassThrough } from '@gravionlabs/helix/types/iconfield';
import type { IftaLabelPassThrough } from '@gravionlabs/helix/types/iftalabel';
import type { ImagePassThrough } from '@gravionlabs/helix/types/image';
import type { ImageComparePassThrough } from '@gravionlabs/helix/types/imagecompare';
import type { InplacePassThrough } from '@gravionlabs/helix/types/inplace';
import type { InputGroupPassThrough } from '@gravionlabs/helix/types/inputgroup';
import type { InputGroupAddonPassThrough } from '@gravionlabs/helix/types/inputgroupaddon';
import type { InputIconPassThrough } from '@gravionlabs/helix/types/inputicon';
import type { InputMaskPassThrough } from '@gravionlabs/helix/types/inputmask';
import type { InputNumberPassThrough } from '@gravionlabs/helix/types/inputnumber';
import type { InputOtpPassThrough } from '@gravionlabs/helix/types/inputotp';
import type { InputTextPassThrough } from '@gravionlabs/helix/types/inputtext';
import type { KnobPassThrough } from '@gravionlabs/helix/types/knob';
import type { MegaMenuPassThrough } from '@gravionlabs/helix/types/megamenu';
import type { MenuPassThrough } from '@gravionlabs/helix/types/menu';
import type { MenubarPassThrough } from '@gravionlabs/helix/types/menubar';
import type { MessagePassThrough } from '@gravionlabs/helix/types/message';
import type { MeterGroupPassThrough } from '@gravionlabs/helix/types/metergroup';
import type { OrderListPassThrough } from '@gravionlabs/helix/types/orderlist';
import type { OrganizationChartPassThrough } from '@gravionlabs/helix/types/organizationchart';
import type { OverlayBadgePassThrough } from '@gravionlabs/helix/types/overlaybadge';
import type { PanelPassThrough } from '@gravionlabs/helix/types/panel';
import type { PanelMenuPassThrough } from '@gravionlabs/helix/types/panelmenu';
import type { PopoverPassThrough } from '@gravionlabs/helix/types/popover';
import type { ProgressBarPassThrough } from '@gravionlabs/helix/types/progressbar';
import type { ProgressSpinnerPassThrough } from '@gravionlabs/helix/types/progressspinner';
import type { RadioButtonPassThrough } from '@gravionlabs/helix/types/radiobutton';
import type { RatingPassThrough } from '@gravionlabs/helix/types/rating';
import type { VirtualScrollerPassThrough } from '@gravionlabs/helix/types/scroller';
import type { ScrollPanelPassThrough } from '@gravionlabs/helix/types/scrollpanel';
import type { ScrollTopPassThrough } from '@gravionlabs/helix/types/scrolltop';
import type { SelectPassThrough } from '@gravionlabs/helix/types/select';
import type { SelectButtonPassThrough } from '@gravionlabs/helix/types/selectbutton';
import type { SkeletonPassThrough } from '@gravionlabs/helix/types/skeleton';
import type { SliderPassThrough } from '@gravionlabs/helix/types/slider';
import type { SpeedDialPassThrough } from '@gravionlabs/helix/types/speeddial';
import type { SplitButtonPassThrough } from '@gravionlabs/helix/types/splitbutton';
import type { SplitterPassThrough } from '@gravionlabs/helix/types/splitter';
import type { StepperPassThrough } from '@gravionlabs/helix/types/stepper';
import type { ColumnFilterPassThrough, TablePassThrough } from '@gravionlabs/helix/types/table';
import type { TabListPassThrough, TabPanelPassThrough, TabPanelsPassThrough, TabPassThrough, TabsPassThrough } from '@gravionlabs/helix/types/tabs';
import type { TagPassThrough } from '@gravionlabs/helix/types/tag';
import type { TerminalPassThrough } from '@gravionlabs/helix/types/terminal';
import type { TieredMenuPassThrough } from '@gravionlabs/helix/types/tieredmenu';
import type { TimelinePassThrough } from '@gravionlabs/helix/types/timeline';
import type { ToastPassThrough } from '@gravionlabs/helix/types/toast';
import type { ToggleButtonPassThrough } from '@gravionlabs/helix/types/togglebutton';
import type { ToggleSwitchPassThrough } from '@gravionlabs/helix/types/toggleswitch';
import type { ToolbarPassThrough } from '@gravionlabs/helix/types/toolbar';
import type { TreePassThrough } from '@gravionlabs/helix/types/tree';
import type { TreeSelectPassThrough } from '@gravionlabs/helix/types/treeselect';
import type { TreeTablePassThrough } from '@gravionlabs/helix/types/treetable';

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

export type PrimeNGConfigType = {
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
