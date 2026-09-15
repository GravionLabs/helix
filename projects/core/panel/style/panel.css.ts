export const style = /*css*/ `
    .h-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .h-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .h-panel-toggleable .h-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .h-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .h-panel-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .h-panel-content-wrapper {
        min-height: 0;
    }

    .h-panel-content {
        padding: dt('panel.content.padding');
    }

    .h-panel-footer {
        padding: dt('panel.footer.padding');
    }
`;
