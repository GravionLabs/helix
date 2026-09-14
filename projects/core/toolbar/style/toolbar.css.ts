export const style = /*css*/ `
    .h-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: dt('toolbar.padding');
        background: dt('toolbar.background');
        border: 1px solid dt('toolbar.border.color');
        color: dt('toolbar.color');
        border-radius: dt('toolbar.border.radius');
        gap: dt('toolbar.gap');
    }

    .h-toolbar-start,
    .h-toolbar-center,
    .h-toolbar-end {
        display: flex;
        align-items: center;
    }
`;
