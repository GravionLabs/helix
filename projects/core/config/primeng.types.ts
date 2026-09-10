import type { ElementRef, TemplateRef } from '@angular/core';
import type { OverlayOptions, PassThroughOptions, Translation } from '@helix-ui/core/api';
import type { AccordionPassThrough } from '@helix-ui/core/types/accordion';
import type { AutoCompletePassThrough } from '@helix-ui/core/types/autocomplete';
import type { AvatarPassThrough } from '@helix-ui/core/types/avatar';
import type { AvatarGroupPassThrough } from '@helix-ui/core/types/avatargroup';
import type { BadgePassThrough } from '@helix-ui/core/types/badge';
import type { BlockUIPassThrough } from '@helix-ui/core/types/blockui';
import type { BreadcrumbPassThrough } from '@helix-ui/core/types/breadcrumb';
import type { ButtonPassThrough } from '@helix-ui/core/types/button';
import type { CardPassThrough } from '@helix-ui/core/types/card';
import type { CarouselPassThrough } from '@helix-ui/core/types/carousel';
import type { CascadeSelectPassThrough } from '@helix-ui/core/types/cascadeselect';
import type { CheckboxPassThrough } from '@helix-ui/core/types/checkbox';
import type { ChipPassThrough } from '@helix-ui/core/types/chip';
import type { ColorPickerPassThrough } from '@helix-ui/core/types/colorpicker';
import type { ConfirmDialogPassThrough } from '@helix-ui/core/types/confirmdialog';
import type { ConfirmPopupPassThrough } from '@helix-ui/core/types/confirmpopup';
import type { DialogPassThrough } from '@helix-ui/core/types/dialog';
import type { DividerPassThrough } from '@helix-ui/core/types/divider';
import type { DockPassThrough } from '@helix-ui/core/types/dock';
import type { DrawerPassThrough } from '@helix-ui/core/types/drawer';
import type { EditorPassThrough } from '@helix-ui/core/types/editor';
import type { FieldsetPassThrough } from '@helix-ui/core/types/fieldset';
import type { FileUploadPassThrough } from '@helix-ui/core/types/fileupload';
import type { FloatLabelPassThrough } from '@helix-ui/core/types/floatlabel';
import type { FluidPassThrough } from '@helix-ui/core/types/fluid';
import type { GalleriaPassThrough } from '@helix-ui/core/types/galleria';
import type { IconFieldPassThrough } from '@helix-ui/core/types/iconfield';
import type { IftaLabelPassThrough } from '@helix-ui/core/types/iftalabel';
import type { ImagePassThrough } from '@helix-ui/core/types/image';
import type { ImageComparePassThrough } from '@helix-ui/core/types/imagecompare';
import type { InplacePassThrough } from '@helix-ui/core/types/inplace';
import type { InputGroupPassThrough } from '@helix-ui/core/types/inputgroup';
import type { InputGroupAddonPassThrough } from '@helix-ui/core/types/inputgroupaddon';
import type { InputIconPassThrough } from '@helix-ui/core/types/inputicon';
import type { InputMaskPassThrough } from '@helix-ui/core/types/inputmask';
import type { InputNumberPassThrough } from '@helix-ui/core/types/inputnumber';
import type { InputOtpPassThrough } from '@helix-ui/core/types/inputotp';
import type { InputTextPassThrough } from '@helix-ui/core/types/inputtext';
import type { KnobPassThrough } from '@helix-ui/core/types/knob';
import type { MegaMenuPassThrough } from '@helix-ui/core/types/megamenu';
import type { MenuPassThrough } from '@helix-ui/core/types/menu';
import type { MenubarPassThrough } from '@helix-ui/core/types/menubar';
import type { MessagePassThrough } from '@helix-ui/core/types/message';
import type { MeterGroupPassThrough } from '@helix-ui/core/types/metergroup';
import type { OrderListPassThrough } from '@helix-ui/core/types/orderlist';
import type { OrganizationChartPassThrough } from '@helix-ui/core/types/organizationchart';
import type { OverlayBadgePassThrough } from '@helix-ui/core/types/overlaybadge';
import type { PanelPassThrough } from '@helix-ui/core/types/panel';
import type { PanelMenuPassThrough } from '@helix-ui/core/types/panelmenu';
import type { PopoverPassThrough } from '@helix-ui/core/types/popover';
import type { ProgressBarPassThrough } from '@helix-ui/core/types/progressbar';
import type { ProgressSpinnerPassThrough } from '@helix-ui/core/types/progressspinner';
import type { RadioButtonPassThrough } from '@helix-ui/core/types/radiobutton';
import type { RatingPassThrough } from '@helix-ui/core/types/rating';
import type { VirtualScrollerPassThrough } from '@helix-ui/core/types/scroller';
import type { ScrollPanelPassThrough } from '@helix-ui/core/types/scrollpanel';
import type { ScrollTopPassThrough } from '@helix-ui/core/types/scrolltop';
import type { SelectPassThrough } from '@helix-ui/core/types/select';
import type { SelectButtonPassThrough } from '@helix-ui/core/types/selectbutton';
import type { SkeletonPassThrough } from '@helix-ui/core/types/skeleton';
import type { SliderPassThrough } from '@helix-ui/core/types/slider';
import type { SpeedDialPassThrough } from '@helix-ui/core/types/speeddial';
import type { SplitButtonPassThrough } from '@helix-ui/core/types/splitbutton';
import type { SplitterPassThrough } from '@helix-ui/core/types/splitter';
import type { StepperPassThrough } from '@helix-ui/core/types/stepper';
import type { ColumnFilterPassThrough, TablePassThrough } from '@helix-ui/core/types/table';
import type { TabListPassThrough, TabPanelPassThrough, TabPanelsPassThrough, TabPassThrough, TabsPassThrough } from '@helix-ui/core/types/tabs';
import type { TagPassThrough } from '@helix-ui/core/types/tag';
import type { TerminalPassThrough } from '@helix-ui/core/types/terminal';
import type { TieredMenuPassThrough } from '@helix-ui/core/types/tieredmenu';
import type { TimelinePassThrough } from '@helix-ui/core/types/timeline';
import type { ToastPassThrough } from '@helix-ui/core/types/toast';
import type { ToggleButtonPassThrough } from '@helix-ui/core/types/togglebutton';
import type { ToggleSwitchPassThrough } from '@helix-ui/core/types/toggleswitch';
import type { ToolbarPassThrough } from '@helix-ui/core/types/toolbar';
import type { TreePassThrough } from '@helix-ui/core/types/tree';
import type { TreeSelectPassThrough } from '@helix-ui/core/types/treeselect';
import type { TreeTablePassThrough } from '@helix-ui/core/types/treetable';

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
