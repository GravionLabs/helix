export const style = /*css*/ `
    .h-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .h-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .h-divider-horizontal .h-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .h-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .h-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .h-divider.h-divider-vertical .h-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .h-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .h-divider-solid.h-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .h-divider-solid.h-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .h-divider-dashed.h-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .h-divider-dashed.h-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .h-divider-dotted.h-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .h-divider-dotted.h-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .h-divider-left:dir(rtl),
    .h-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`;
