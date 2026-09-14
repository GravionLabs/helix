export const style = /*css*/ `
    .h-listbox {
        display: block;
        background: dt('listbox.background');
        color: dt('listbox.color');
        border: 1px solid dt('listbox.border.color');
        border-radius: dt('listbox.border.radius');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('listbox.shadow');
    }

    .h-listbox.h-disabled {
        opacity: 1;
        background: dt('listbox.disabled.background');
        color: dt('listbox.disabled.color');
    }

    .h-listbox.h-disabled .h-listbox-option {
        color: dt('listbox.disabled.color');
    }

    .h-listbox.h-invalid {
        border-color: dt('listbox.invalid.border.color');
    }

    .h-listbox-header {
        padding: dt('listbox.list.header.padding');
    }

    .h-listbox-filter {
        width: 100%;
    }

    .h-listbox-list-container {
        overflow: auto;
    }

    .h-listbox-list {
        list-style-type: none;
        margin: 0;
        padding: dt('listbox.list.padding');
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('listbox.list.gap');
    }

    .h-listbox-option {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        padding: dt('listbox.option.padding');
        border: 0 none;
        border-radius: dt('listbox.option.border.radius');
        color: dt('listbox.option.color');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
    }

    .h-listbox-striped li:nth-child(even of .h-listbox-option) {
        background: dt('listbox.option.striped.background');
    }

    .h-listbox .h-listbox-list .h-listbox-option.h-listbox-option-selected {
        background: dt('listbox.option.selected.background');
        color: dt('listbox.option.selected.color');
    }

    .h-listbox:not(.h-disabled) .h-listbox-option.h-listbox-option-selected.h-focus {
        background: dt('listbox.option.selected.focus.background');
        color: dt('listbox.option.selected.focus.color');
    }

    .h-listbox:not(.h-disabled) .h-listbox-option:not(.h-listbox-option-selected):not(.h-disabled).h-focus {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .h-listbox:not(.h-disabled) .h-listbox-option:not(.h-listbox-option-selected):not(.h-disabled):hover {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .h-listbox-option-blank-icon {
        flex-shrink: 0;
    }

    .h-listbox-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('listbox.checkmark.gutter.start');
        margin-inline-end: dt('listbox.checkmark.gutter.end');
        color: dt('listbox.checkmark.color');
    }

    .h-listbox-option-group {
        margin: 0;
        padding: dt('listbox.option.group.padding');
        color: dt('listbox.option.group.color');
        background: dt('listbox.option.group.background');
        font-weight: dt('listbox.option.group.font.weight');
    }

    .h-listbox-empty-message {
        padding: dt('listbox.empty.message.padding');
    }

    .h-listbox-fluid {
        width: 100%;
    }
`;
