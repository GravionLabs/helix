import { Injectable } from '@angular/core';
import { style } from './fileupload.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => `h-fileupload h-fileupload-${instance.mode()} h-component`,
    header: 'h-fileupload-header',
    pcChooseButton: 'h-fileupload-choose-button',
    pcUploadButton: 'h-fileupload-upload-button',
    pcCancelButton: 'h-fileupload-cancel-button',
    content: 'h-fileupload-content',
    fileList: 'h-fileupload-file-list',
    file: 'h-fileupload-file',
    fileThumbnail: 'h-fileupload-file-thumbnail',
    fileInfo: 'h-fileupload-file-info',
    fileName: 'h-fileupload-file-name',
    fileSize: 'h-fileupload-file-size',
    pcFileBadge: 'h-fileupload-file-badge',
    fileActions: 'h-fileupload-file-actions',
    pcFileRemoveButton: 'h-fileupload-file-remove-button',
    basicContent: 'h-fileupload-basic-content'
};

@Injectable()
export class FileUploadStyle extends BaseStyle {
    name = 'fileupload';

    style = style;

    classes = classes;
}

/**
 *
 * FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.
 *
 * [Live Demo](https://www.primeng.org/fileupload/)
 *
 * @module fileuploadstyle
 *
 */

export enum FileUploadClasses {
    /**
     * Class name of the root element
     */
    root = 'h-fileupload',
    /**
     * Class name of the header element
     */
    header = 'h-fileupload-header',
    /**
     * Class name of the choose button element
     */
    pcChooseButton = 'h-fileupload-choose-button',
    /**
     * Class name of the upload button element
     */
    pcUploadButton = 'h-fileupload-upload-button',
    /**
     * Class name of the cancel button element
     */
    pcCancelButton = 'h-fileupload-cancel-button',
    /**
     * Class name of the content element
     */
    content = 'h-fileupload-content',
    /**
     * Class name of the file list element
     */
    fileList = 'h-fileupload-file-list',
    /**
     * Class name of the file element
     */
    file = 'h-fileupload-file',
    /**
     * Class name of the file thumbnail element
     */
    fileThumbnail = 'h-fileupload-file-thumbnail',
    /**
     * Class name of the file info element
     */
    fileInfo = 'h-fileupload-file-info',
    /**
     * Class name of the file name element
     */
    fileName = 'h-fileupload-file-name',
    /**
     * Class name of the file size element
     */
    fileSize = 'h-fileupload-file-size',
    /**
     * Class name of the file badge element
     */
    pcFileBadge = 'h-fileupload-file-badge',
    /**
     * Class name of the file actions element
     */
    fileActions = 'h-fileupload-file-actions',
    /**
     * Class name of the file remove button element
     */
    pcFileRemoveButton = 'h-fileupload-file-remove-button',
    /**
     * Class name of the content in basic mode
     */
    basicContent = 'h-fileupload-basic-content'
}

export interface FileUploadStyle extends BaseStyle {}
