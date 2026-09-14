export const style = /*css*/ `
    .h-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .h-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .h-inputnumber-button:disabled {
        cursor: auto;
    }

    .h-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .h-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .h-inputnumber-stacked .h-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .h-inputnumber-stacked .h-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .h-inputnumber-stacked .h-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .h-inputnumber-stacked .h-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .h-inputnumber-stacked .h-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .h-inputnumber-horizontal .h-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .h-inputnumber-horizontal .h-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .h-inputnumber-horizontal .h-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .h-inputnumber-horizontal .h-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .h-inputnumber-horizontal .h-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .h-inputnumber-horizontal .h-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .h-floatlabel:has(.h-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .h-inputnumber-vertical {
        flex-direction: column;
    }

    .h-inputnumber-vertical .h-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .h-inputnumber-vertical .h-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .h-inputnumber-vertical .h-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .h-inputnumber-vertical .h-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .h-inputnumber-vertical .h-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .h-inputnumber-vertical .h-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .h-inputnumber-input {
        flex: 1 1 auto;
    }

    .h-inputnumber-fluid {
        width: 100%;
    }

    .h-inputnumber-fluid .h-inputnumber-input {
        width: 1%;
    }

    .h-inputnumber-fluid.h-inputnumber-vertical .h-inputnumber-input {
        width: 100%;
    }

    .h-inputnumber:has(.h-inputtext-sm) .h-inputnumber-button .h-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .h-inputnumber:has(.h-inputtext-lg) .h-inputnumber-button .h-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .h-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .h-inputnumber:has(.h-inputnumber-clear-icon) .h-inputnumber-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-inputnumber-stacked .h-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .h-inputnumber-stacked:has(.h-inputnumber-clear-icon) .h-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + (dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-inputnumber-horizontal .h-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`;
