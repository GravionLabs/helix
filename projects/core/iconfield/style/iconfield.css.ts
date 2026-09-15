export const style = /*css*/ `
    .h-iconfield {
        position: relative;
        display: block;
    }

    .h-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .h-iconfield .h-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .h-iconfield .h-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .h-iconfield .h-inputtext:not(:first-child),
    .h-iconfield .h-inputwrapper:not(:first-child) .h-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-iconfield .h-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-iconfield:has(.h-inputfield-sm) .h-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .h-iconfield:has(.h-inputfield-lg) .h-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`;
