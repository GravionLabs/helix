export const style = /*css*/ `
    .h-fileupload input[type='file'] {
        display: none;
    }

    .h-fileupload-advanced {
        border: 1px solid dt('fileupload.border.color');
        border-radius: dt('fileupload.border.radius');
        background: dt('fileupload.background');
        color: dt('fileupload.color');
    }

    .h-fileupload-header {
        display: flex;
        align-items: center;
        padding: dt('fileupload.header.padding');
        background: dt('fileupload.header.background');
        color: dt('fileupload.header.color');
        border-style: solid;
        border-width: dt('fileupload.header.border.width');
        border-color: dt('fileupload.header.border.color');
        border-radius: dt('fileupload.header.border.radius');
        gap: dt('fileupload.header.gap');
    }

    .h-fileupload-content {
        border: 1px solid transparent;
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.content.gap');
        transition: border-color dt('fileupload.transition.duration');
        padding: dt('fileupload.content.padding');
    }

    .h-fileupload-content .h-progressbar {
        width: 100%;
        height: dt('fileupload.progressbar.height');
    }

    .h-fileupload-file-list {
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.filelist.gap');
    }

    .h-fileupload-file {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: dt('fileupload.file.padding');
        border-block-end: 1px solid dt('fileupload.file.border.color');
        gap: dt('fileupload.file.gap');
    }

    .h-fileupload-file:last-child {
        border-block-end: 0;
    }

    .h-fileupload-file-info {
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.file.info.gap');
    }

    .h-fileupload-file-thumbnail {
        flex-shrink: 0;
    }

    .h-fileupload-file-actions {
        margin-inline-start: auto;
    }

    .h-fileupload-highlight {
        border: 1px dashed dt('fileupload.content.highlight.border.color');
    }

    .h-fileupload-basic .h-message {
        margin-block-end: dt('fileupload.basic.gap');
    }

    .h-fileupload-basic-content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: dt('fileupload.basic.gap');
    }
`;
