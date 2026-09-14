export const style = /*css*/ `
    .h-floatlabel {
        display: block;
        position: relative;
    }

    .h-floatlabel label {
        position: absolute;
        pointer-events: none;
        top: 50%;
        transform: translateY(-50%);
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-weight: dt('floatlabel.font.weight');
        inset-inline-start: dt('floatlabel.position.x');
        color: dt('floatlabel.color');
        transition-duration: dt('floatlabel.transition.duration');
    }

    .h-floatlabel:has(.h-textarea) label {
        top: dt('floatlabel.position.y');
        transform: translateY(0);
    }

    .h-floatlabel:has(.h-inputicon:first-child) label {
        inset-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-floatlabel:has(input:focus) label,
    .h-floatlabel:has(input.h-filled) label,
    .h-floatlabel:has(input:-webkit-autofill) label,
    .h-floatlabel:has(textarea:focus) label,
    .h-floatlabel:has(textarea.h-filled) label,
    .h-floatlabel:has(.h-inputwrapper-focus) label,
    .h-floatlabel:has(.h-inputwrapper-filled) label,
    .h-floatlabel:has(input[placeholder]) label,
    .h-floatlabel:has(textarea[placeholder]) label {
        top: dt('floatlabel.over.active.top');
        transform: translateY(0);
        font-size: dt('floatlabel.active.font.size');
        font-weight: dt('floatlabel.active.font.weight');
    }

    .h-floatlabel:has(input.h-filled) label,
    .h-floatlabel:has(textarea.h-filled) label,
    .h-floatlabel:has(.h-inputwrapper-filled) label {
        color: dt('floatlabel.active.color');
    }

    .h-floatlabel:has(input:focus) label,
    .h-floatlabel:has(input:-webkit-autofill) label,
    .h-floatlabel:has(textarea:focus) label,
    .h-floatlabel:has(.h-inputwrapper-focus) label {
        color: dt('floatlabel.focus.color');
    }

    .h-floatlabel-in .h-inputtext,
    .h-floatlabel-in .h-textarea,
    .h-floatlabel-in .h-select-label,
    .h-floatlabel-in .h-multiselect-label,
    .h-floatlabel-in .h-multiselect-label:has(.h-chip),
    .h-floatlabel-in .h-autocomplete-input-multiple,
    .h-floatlabel-in .h-cascadeselect-label,
    .h-floatlabel-in .h-treeselect-label {
        padding-block-start: dt('floatlabel.in.input.padding.top');
        padding-block-end: dt('floatlabel.in.input.padding.bottom');
    }

    .h-floatlabel-in:has(input:focus) label,
    .h-floatlabel-in:has(input.h-filled) label,
    .h-floatlabel-in:has(input:-webkit-autofill) label,
    .h-floatlabel-in:has(textarea:focus) label,
    .h-floatlabel-in:has(textarea.h-filled) label,
    .h-floatlabel-in:has(.h-inputwrapper-focus) label,
    .h-floatlabel-in:has(.h-inputwrapper-filled) label,
    .h-floatlabel-in:has(input[placeholder]) label,
    .h-floatlabel-in:has(textarea[placeholder]) label {
        top: dt('floatlabel.in.active.top');
    }

    .h-floatlabel-on:has(input:focus) label,
    .h-floatlabel-on:has(input.h-filled) label,
    .h-floatlabel-on:has(input:-webkit-autofill) label,
    .h-floatlabel-on:has(textarea:focus) label,
    .h-floatlabel-on:has(textarea.h-filled) label,
    .h-floatlabel-on:has(.h-inputwrapper-focus) label,
    .h-floatlabel-on:has(.h-inputwrapper-filled) label,
    .h-floatlabel-on:has(input[placeholder]) label,
    .h-floatlabel-on:has(textarea[placeholder]) label {
        top: 0;
        transform: translateY(-50%);
        border-radius: dt('floatlabel.on.border.radius');
        background: dt('floatlabel.on.active.background');
        padding: dt('floatlabel.on.active.padding');
    }

    .h-floatlabel:has([class^='p-'][class$='-fluid']) {
        width: 100%;
    }

    .h-floatlabel:has(.h-invalid) label {
        color: dt('floatlabel.invalid.color');
    }
`;
