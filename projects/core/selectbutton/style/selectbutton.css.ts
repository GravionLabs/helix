export const style = /*css*/ `
    .h-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .h-selectbutton .h-togglebutton {
        border-radius: 0;
        border-width: 1px 1px 1px 0;
    }

    .h-selectbutton .h-togglebutton:focus-visible {
        position: relative;
        z-index: 1;
    }

    .h-selectbutton .h-togglebutton:first-child {
        border-inline-start-width: 1px;
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .h-selectbutton .h-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .h-selectbutton.h-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .h-selectbutton-fluid {
        width: 100%;
    }
    
    .h-selectbutton-fluid .h-togglebutton {
        flex: 1 1 0;
    }
`;
