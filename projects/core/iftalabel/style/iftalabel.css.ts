export const style = /*css*/ `
    .h-iftalabel {
        display: block;
        position: relative;
    }

    .h-iftalabel label {
        position: absolute;
        pointer-events: none;
        top: dt('iftalabel.top');
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-size: dt('iftalabel.font.size');
        font-weight: dt('iftalabel.font.weight');
        inset-inline-start: dt('iftalabel.position.x');
        color: dt('iftalabel.color');
        transition-duration: dt('iftalabel.transition.duration');
    }

    .h-iftalabel .h-inputtext,
    .h-iftalabel .h-textarea,
    .h-iftalabel .h-select-label,
    .h-iftalabel .h-multiselect-label,
    .h-iftalabel .h-multiselect-label:has(.h-chip),
    .h-iftalabel .h-autocomplete-input-multiple,
    .h-iftalabel .h-cascadeselect-label,
    .h-iftalabel .h-treeselect-label {
        padding-block-start: dt('iftalabel.input.padding.top');
        padding-block-end: dt('iftalabel.input.padding.bottom');
    }

    .h-iftalabel:has(.h-invalid) label {
        color: dt('iftalabel.invalid.color');
    }

    .h-iftalabel:has(input:focus) label,
    .h-iftalabel:has(input:-webkit-autofill) label,
    .h-iftalabel:has(textarea:focus) label,
    .h-iftalabel:has(.h-inputwrapper-focus) label {
        color: dt('iftalabel.focus.color');
    }

    .h-iftalabel .h-inputicon {
        top: dt('iftalabel.input.padding.top');
        transform: translateY(25%);
        margin-top: 0;
    }
`;
