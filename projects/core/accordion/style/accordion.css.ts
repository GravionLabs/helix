export const style = /*css*/ `
    .h-accordionpanel {
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: dt('accordion.panel.border.width');
        border-color: dt('accordion.panel.border.color');
    }

    .h-accordionheader {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: dt('accordion.header.padding');
        color: dt('accordion.header.color');
        background: dt('accordion.header.background');
        border-style: solid;
        border-width: dt('accordion.header.border.width');
        border-color: dt('accordion.header.border.color');
        font-weight: dt('accordion.header.font.weight');
        border-radius: dt('accordion.header.border.radius');
        transition:
            background dt('accordion.transition.duration'),
            color dt('accordion.transition.duration'),
            outline-color dt('accordion.transition.duration'),
            box-shadow dt('accordion.transition.duration');
        outline-color: transparent;
    }

    .h-accordionpanel:first-child > .h-accordionheader {
        border-width: dt('accordion.header.first.border.width');
        border-start-start-radius: dt('accordion.header.first.top.border.radius');
        border-start-end-radius: dt('accordion.header.first.top.border.radius');
    }

    .h-accordionpanel:last-child > .h-accordionheader {
        border-end-start-radius: dt('accordion.header.last.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.bottom.border.radius');
    }

    .h-accordionpanel:last-child.h-accordionpanel-active > .h-accordionheader {
        border-end-start-radius: dt('accordion.header.last.active.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.active.bottom.border.radius');
    }

    .h-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.color');
    }

    .h-accordionpanel:not(.h-disabled) .h-accordionheader:focus-visible {
        box-shadow: dt('accordion.header.focus.ring.shadow');
        outline: dt('accordion.header.focus.ring.width') dt('accordion.header.focus.ring.style') dt('accordion.header.focus.ring.color');
        outline-offset: dt('accordion.header.focus.ring.offset');
    }

    .h-accordionpanel:not(.h-accordionpanel-active):not(.h-disabled) > .h-accordionheader:hover {
        background: dt('accordion.header.hover.background');
        color: dt('accordion.header.hover.color');
    }

    .h-accordionpanel:not(.h-accordionpanel-active):not(.h-disabled) .h-accordionheader:hover .h-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.hover.color');
    }

    .h-accordionpanel:not(.h-disabled).h-accordionpanel-active > .h-accordionheader {
        background: dt('accordion.header.active.background');
        color: dt('accordion.header.active.color');
    }

    .h-accordionpanel:not(.h-disabled).h-accordionpanel-active > .h-accordionheader .h-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.color');
    }

    .h-accordionpanel:not(.h-disabled).h-accordionpanel-active > .h-accordionheader:hover {
        background: dt('accordion.header.active.hover.background');
        color: dt('accordion.header.active.hover.color');
    }

    .h-accordionpanel:not(.h-disabled).h-accordionpanel-active > .h-accordionheader:hover .h-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.hover.color');
    }

    .h-accordioncontent {
        display: grid;
        grid-template-rows: 1fr;
    }

    .h-accordioncontent-wrapper {
        min-height: 0;
    }

    .h-accordioncontent-content {
        border-style: solid;
        border-width: dt('accordion.content.border.width');
        border-color: dt('accordion.content.border.color');
        background-color: dt('accordion.content.background');
        color: dt('accordion.content.color');
        padding: dt('accordion.content.padding');
    }
`;
