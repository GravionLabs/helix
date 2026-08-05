import type { ElementRef, TemplateRef } from '@angular/core';
import type { OverlayOptions, PassThroughOptions, Translation } from '@helix/core/api';
import type { AccordionPassThrough } from '@helix/core/types/accordion';
import type { AutoCompletePassThrough } from '@helix/core/types/autocomplete';
import type { AvatarPassThrough } from '@helix/core/types/avatar';
import type { AvatarGroupPassThrough } from '@helix/core/types/avatargroup';
import type { BadgePassThrough } from '@helix/core/types/badge';
import type { BlockUIPassThrough } from '@helix/core/types/blockui';
import type { BreadcrumbPassThrough } from '@helix/core/types/breadcrumb';
import type { ButtonPassThrough } from '@helix/core/types/button';
import type { CardPassThrough } from '@helix/core/types/card';
import type { CarouselPassThrough } from '@helix/core/types/carousel';
import type { CascadeSelectPassThrough } from '@helix/core/types/cascadeselect';
import type { CheckboxPassThrough } from '@helix/core/types/checkbox';
import type { ChipPassThrough } from '@helix/core/types/chip';
import type { ColorPickerPassThrough } from '@helix/core/types/colorpicker';
import type { ConfirmDialogPassThrough } from '@helix/core/types/confirmdialog';
import type { ConfirmPopupPassThrough } from '@helix/core/types/confirmpopup';
import type { DialogPassThrough } from '@helix/core/types/dialog';
import type { DividerPassThrough } from '@helix/core/types/divider';
import type { DockPassThrough } from '@helix/core/types/dock';
import type { DrawerPassThrough } from '@helix/core/types/drawer';
import type { EditorPassThrough } from '@helix/core/types/editor';
import type { FieldsetPassThrough } from '@helix/core/types/fieldset';
import type { FileUploadPassThrough } from '@helix/core/types/fileupload';
import type { FloatLabelPassThrough } from '@helix/core/types/floatlabel';
import type { FluidPassThrough } from '@helix/core/types/fluid';
import type { GalleriaPassThrough } from '@helix/core/types/galleria';
import type { IconFieldPassThrough } from '@helix/core/types/iconfield';
import type { IftaLabelPassThrough } from '@helix/core/types/iftalabel';
import type { ImagePassThrough } from '@helix/core/types/image';
import type { ImageComparePassThrough } from '@helix/core/types/imagecompare';
import type { InplacePassThrough } from '@helix/core/types/inplace';
import type { InputGroupPassThrough } from '@helix/core/types/inputgroup';
import type { InputGroupAddonPassThrough } from '@helix/core/types/inputgroupaddon';
import type { InputIconPassThrough } from '@helix/core/types/inputicon';
import type { InputMaskPassThrough } from '@helix/core/types/inputmask';
import type { InputNumberPassThrough } from '@helix/core/types/inputnumber';
import type { InputOtpPassThrough } from '@helix/core/types/inputotp';
import type { InputTextPassThrough } from '@helix/core/types/inputtext';
import type { KnobPassThrough } from '@helix/core/types/knob';
import type { MegaMenuPassThrough } from '@helix/core/types/megamenu';
import type { MenuPassThrough } from '@helix/core/types/menu';
import type { MenubarPassThrough } from '@helix/core/types/menubar';
import type { MessagePassThrough } from '@helix/core/types/message';
import type { MeterGroupPassThrough } from '@helix/core/types/metergroup';
import type { OrderListPassThrough } from '@helix/core/types/orderlist';
import type { OrganizationChartPassThrough } from '@helix/core/types/organizationchart';
import type { OverlayBadgePassThrough } from '@helix/core/types/overlaybadge';
import type { PanelPassThrough } from '@helix/core/types/panel';
import type { PanelMenuPassThrough } from '@helix/core/types/panelmenu';
import type { PopoverPassThrough } from '@helix/core/types/popover';
import type { ProgressBarPassThrough } from '@helix/core/types/progressbar';
import type { ProgressSpinnerPassThrough } from '@helix/core/types/progressspinner';
import type { RadioButtonPassThrough } from '@helix/core/types/radiobutton';
import type { RatingPassThrough } from '@helix/core/types/rating';
import type { VirtualScrollerPassThrough } from '@helix/core/types/scroller';
import type { ScrollPanelPassThrough } from '@helix/core/types/scrollpanel';
import type { ScrollTopPassThrough } from '@helix/core/types/scrolltop';
import type { SelectPassThrough } from '@helix/core/types/select';
import type { SelectButtonPassThrough } from '@helix/core/types/selectbutton';
import type { SkeletonPassThrough } from '@helix/core/types/skeleton';
import type { SliderPassThrough } from '@helix/core/types/slider';
import type { SpeedDialPassThrough } from '@helix/core/types/speeddial';
import type { SplitButtonPassThrough } from '@helix/core/types/splitbutton';
import type { SplitterPassThrough } from '@helix/core/types/splitter';
import type { StepperPassThrough } from '@helix/core/types/stepper';
import type { ColumnFilterPassThrough, TablePassThrough } from '@helix/core/types/table';
import type { TabListPassThrough, TabPanelPassThrough, TabPanelsPassThrough, TabPassThrough, TabsPassThrough } from '@helix/core/types/tabs';
import type { TagPassThrough } from '@helix/core/types/tag';
import type { TerminalPassThrough } from '@helix/core/types/terminal';
import type { TieredMenuPassThrough } from '@helix/core/types/tieredmenu';
import type { TimelinePassThrough } from '@helix/core/types/timeline';
import type { ToastPassThrough } from '@helix/core/types/toast';
import type { ToggleButtonPassThrough } from '@helix/core/types/togglebutton';
import type { ToggleSwitchPassThrough } from '@helix/core/types/toggleswitch';
import type { ToolbarPassThrough } from '@helix/core/types/toolbar';
import type { TreePassThrough } from '@helix/core/types/tree';
import type { TreeSelectPassThrough } from '@helix/core/types/treeselect';
import type { TreeTablePassThrough } from '@helix/core/types/treetable';

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
