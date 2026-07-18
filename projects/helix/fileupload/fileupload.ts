import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, InjectionToken, input, model, NgModule, NgZone, numberAttribute, output, TemplateRef, ViewEncapsulation, contentChild, viewChild, contentChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { addClass, removeClass } from '@primeuix/utils';
import { BlockableUI, PrimeTemplate, SharedModule, TranslationKeys } from '@gravionlabs/helix/api';
import { Badge } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { Button, ButtonProps } from '@gravionlabs/helix/button';
import { PlusIcon, TimesIcon, UploadIcon } from '@gravionlabs/helix/icons';
import { Message } from '@gravionlabs/helix/message';
import { ProgressBar } from '@gravionlabs/helix/progressbar';
import { VoidListener } from '@gravionlabs/helix/ts-helpers';
import {
    FileBeforeUploadEvent,
    FileProgressEvent,
    FileRemoveEvent,
    FileSelectEvent,
    FileSendEvent,
    FileUploadContentTemplateContext,
    FileUploadErrorEvent,
    FileUploadEvent,
    FileUploadFileLabelTemplateContext,
    FileUploadHandlerEvent,
    FileUploadHeaderTemplateContext,
    FileUploadPassThrough,
    RemoveUploadedFileEvent
} from '@gravionlabs/helix/types/fileupload';
import { Subscription } from 'rxjs';
import { FileUploadStyle } from './style/fileuploadstyle';

const FILEUPLOAD_INSTANCE = new InjectionToken<FileUpload>('FILEUPLOAD_INSTANCE');

@Component({
    selector: '[hFileContent]',
    standalone: true,
    templateUrl: './filecontent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FileUploadStyle],
    imports: [CommonModule, Badge, Button, TimesIcon, Bind]
})
export class FileContent extends BaseComponent {
    _componentStyle = inject(FileUploadStyle);

    $pcFileUpload = inject(FILEUPLOAD_INSTANCE);

    onRemove = output<any>();

    files = input<any>();

    badgeSeverity = input<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast'>('warn');

    badgeValue = input<string>();

    previewWidth = input<number>(50);

    fileRemoveIconTemplate = input<any>();

    onRemoveClick(event: any, index: number) {
        this.onRemove.emit({ event, index });
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }
}
/**
 * FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.
 * @group Components
 */
@Component({
    selector: 'h-fileupload, h-fileUpload',
    standalone: true,
    imports: [CommonModule, Button, ProgressBar, Message, PlusIcon, UploadIcon, TimesIcon, SharedModule, FileContent, Bind],
    templateUrl: './fileupload.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FileUploadStyle, { provide: FILEUPLOAD_INSTANCE, useExisting: FileUpload }, { provide: PARENT_INSTANCE, useExisting: FileUpload }],
    hostDirectives: [Bind]
})
export class FileUpload extends BaseComponent<FileUploadPassThrough> implements BlockableUI {
    componentName = 'FileUpload';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    /**
     * Name of the request parameter to identify the files at backend.
     * @group Props
     */
    readonly name = input<string>();
    /**
     * Remote url to upload the files.
     * @group Props
     */
    readonly url = input<string>();
    /**
     * HTTP method to send the files to the url such as "post" and "put".
     * @group Props
     */
    readonly method = input<'post' | 'put' | undefined>('post');
    /**
     * Used to select multiple files at once from file dialog.
     * @group Props
     */
    readonly multiple = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Comma-separated list of pattern to restrict the allowed file types. Can be any combination of either the MIME types (such as "image/*") or the file extensions (such as ".jpg").
     * @group Props
     */
    readonly accept = input<string>();
    /**
     * Disables the upload functionality.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, upload begins automatically after selection is completed.
     * @group Props
     */
    readonly auto = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates.
     * @group Props
     */
    readonly withCredentials = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Maximum file size allowed in bytes.
     * @group Props
     */
    readonly maxFileSize = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * Summary message of the invalid file size.
     * @group Props
     */
    readonly invalidFileSizeMessageSummary = input<string>('{0}: Invalid file size, ');
    /**
     * Detail message of the invalid file size.
     * @group Props
     */
    readonly invalidFileSizeMessageDetail = input<string>('maximum upload size is {0}.');
    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    readonly invalidFileTypeMessageSummary = input<string>('{0}: Invalid file type, ');
    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    readonly invalidFileTypeMessageDetail = input<string>('allowed file types: {0}.');
    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    readonly invalidFileLimitMessageDetail = input<string>('limit is {0} at most.');
    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    readonly invalidFileLimitMessageSummary = input<string>('Maximum number of files exceeded, ');
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();
    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Width of the image thumbnail in pixels.
     * @group Props
     */
    readonly previewWidth = input<number, unknown>(50, { transform: numberAttribute });
    /**
     * Label of the choose button. Defaults to Helix Locale configuration.
     * @group Props
     */
    readonly chooseLabel = input<string>();
    /**
     * Label of the upload button. Defaults to Helix Locale configuration.
     * @group Props
     */
    readonly uploadLabel = input<string>();
    /**
     * Label of the cancel button. Defaults to Helix Locale configuration.
     * @group Props
     */
    readonly cancelLabel = input<string>();
    /**
     * Icon of the choose button.
     * @group Props
     */
    readonly chooseIcon = input<string>();
    /**
     * Icon of the upload button.
     * @group Props
     */
    readonly uploadIcon = input<string>();
    /**
     * Icon of the cancel button.
     * @group Props
     */
    readonly cancelIcon = input<string>();
    /**
     * Whether to show the upload button.
     * @group Props
     */
    readonly showUploadButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show the cancel button.
     * @group Props
     */
    readonly showCancelButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines the UI of the component.
     * @group Props
     */
    readonly mode = input<'advanced' | 'basic' | undefined>('advanced');
    /**
     * HttpHeaders class represents the header configuration options for an HTTP request.
     * @group Props
     */
    readonly headers = input<HttpHeaders>();
    /**
     * Whether to use the default upload or a manual implementation defined in uploadHandler callback. Defaults to Helix Locale configuration.
     * @group Props
     */
    readonly customUpload = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Maximum number of files that can be uploaded.
     * @group Props
     */
    readonly fileLimit = input<number, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Style class of the upload button.
     * @group Props
     */
    readonly uploadStyleClass = input<string>();
    /**
     * Style class of the cancel button.
     * @group Props
     */
    readonly cancelStyleClass = input<string>();
    /**
     * Style class of the remove button.
     * @group Props
     */
    readonly removeStyleClass = input<string>();
    /**
     * Style class of the choose button.
     * @group Props
     */
    readonly chooseStyleClass = input<string>();
    /**
     * Used to pass all properties of the ButtonProps to the choose button inside the component.
     * @group Props
     */
    readonly chooseButtonProps = input<ButtonProps>(undefined!);
    /**
     * Used to pass all properties of the ButtonProps to the upload button inside the component.
     * @group Props
     */
    readonly uploadButtonProps = input<ButtonProps>({ severity: 'secondary' });
    /**
     * Used to pass all properties of the ButtonProps to the cancel button inside the component.
     * @group Props
     */
    readonly cancelButtonProps = input<ButtonProps>({ severity: 'secondary' });
    /**
     * Callback to invoke before file upload is initialized.
     * @param {FileBeforeUploadEvent} event - Custom upload event.
     * @group Emits
     */
    readonly onBeforeUpload = output<FileBeforeUploadEvent>();
    /**
     * An event indicating that the request was sent to the server. Useful when a request may be retried multiple times, to distinguish between retries on the final event stream.
     * @param {FileSendEvent} event - Custom send event.
     * @group Emits
     */
    readonly onSend = output<FileSendEvent>();
    /**
     * Callback to invoke when file upload is complete.
     * @param {FileUploadEvent} event - Custom upload event.
     * @group Emits
     */
    readonly onUpload = output<FileUploadEvent>();
    /**
     * Callback to invoke if file upload fails.
     * @param {FileUploadErrorEvent} event - Custom error event.
     * @group Emits
     */
    readonly onError = output<FileUploadErrorEvent>();
    /**
     * Callback to invoke when files in queue are removed without uploading using clear all button.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onClear = output<void>();
    /**
     * Callback to invoke when a file is removed without uploading using clear button of a file.
     * @param {FileRemoveEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemove = output<FileRemoveEvent>();
    /**
     * Callback to invoke when files are selected.
     * @param {FileSelectEvent} event - Select event.
     * @group Emits
     */
    readonly onSelect = output<FileSelectEvent>();
    /**
     * Callback to invoke when files are being uploaded.
     * @param {FileProgressEvent} event - Progress event.
     * @group Emits
     */
    readonly onProgress = output<FileProgressEvent>();
    /**
     * Callback to invoke in custom upload mode to upload the files manually.
     * @param {FileUploadHandlerEvent} event - Upload handler event.
     * @group Emits
     */
    readonly uploadHandler = output<FileUploadHandlerEvent>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {RemoveUploadedFileEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemoveUploadedFile = output<RemoveUploadedFileEvent>();

    /**
     * Custom file template.
     * @group Templates
     */
    readonly fileTemplate = contentChild<TemplateRef<void>>('file', { descendants: false });

    /**
     * Custom header template.
     * @param {FileUploadHeaderTemplateContext} context - header template context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<FileUploadHeaderTemplateContext>>('header', { descendants: false });

    /**
     * Custom content template.
     * @param {FileUploadContentTemplateContext} context - content template context.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<FileUploadContentTemplateContext>>('content', { descendants: false });

    /**
     * Custom toolbar template.
     * @group Templates
     */
    readonly toolbarTemplate = contentChild<TemplateRef<void>>('toolbar', { descendants: false });

    /**
     * Custom choose icon template.
     * @group Templates
     */
    readonly chooseIconTemplate = contentChild<TemplateRef<void>>('chooseicon', { descendants: false });

    /**
     * Custom file label template.
     * @param {FileUploadFileLabelTemplateContext} context - file label template context.
     * @group Templates
     */
    readonly fileLabelTemplate = contentChild<TemplateRef<FileUploadFileLabelTemplateContext>>('filelabel', { descendants: false });

    /**
     * Custom upload icon template.
     * @group Templates
     */
    readonly uploadIconTemplate = contentChild<TemplateRef<void>>('uploadicon', { descendants: false });

    /**
     * Custom cancel icon template.
     * @group Templates
     */
    readonly cancelIconTemplate = contentChild<TemplateRef<void>>('cancelicon', { descendants: false });

    /**
     * Custom empty state template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    readonly advancedFileInput = viewChild<ElementRef>('advancedfileinput');

    readonly basicFileInput = viewChild<ElementRef>('basicfileinput');

    readonly content = viewChild<ElementRef>('content');

    readonly files = model<File[]>([]);

    public get basicButtonLabel(): string {
        if (this.auto() || !this.hasFiles()) {
            return this.chooseLabel() as string;
        }

        return this.uploadLabel() ?? this.files()[0].name;
    }

    public progress: number = 0;

    public dragHighlight: boolean | undefined;

    public msgs: any[] | undefined;

    public uploadedFileCount: number = 0;

    focus: boolean | undefined;

    uploading: boolean | undefined;

    duplicateIEEvent: boolean | undefined; // flag to recognize duplicate onchange event for file input

    translationSubscription: Subscription | undefined;

    dragOverListener: VoidListener;

    public uploadedFiles: File[] = [];

    sanitizer: DomSanitizer = inject(DomSanitizer);

    zone: NgZone = inject(NgZone);

    http: HttpClient = inject(HttpClient);

    _componentStyle = inject(FileUploadStyle);

    onInit() {
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.cd.markForCheck();
        });
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mode() === 'advanced') {
                this.zone.runOutsideAngular(() => {
                    const content = this.content();
                    if (content) {
                        this.dragOverListener = this.renderer.listen(content.nativeElement, 'dragover', this.onDragOver.bind(this));
                    }
                });
            }
        }
    }

    _headerTemplate: TemplateRef<FileUploadHeaderTemplateContext> | undefined;

    _contentTemplate: TemplateRef<FileUploadContentTemplateContext> | undefined;

    _toolbarTemplate: TemplateRef<void> | undefined;

    _chooseIconTemplate: TemplateRef<void> | undefined;

    _uploadIconTemplate: TemplateRef<void> | undefined;

    _cancelIconTemplate: TemplateRef<void> | undefined;

    _emptyTemplate: TemplateRef<void> | undefined;

    _fileTemplate: TemplateRef<void> | undefined;

    _fileLabelTemplate: TemplateRef<FileUploadFileLabelTemplateContext> | undefined;

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'file':
                    this._fileTemplate = item.template;
                    break;

                case 'content':
                    this._contentTemplate = item.template;
                    break;

                case 'toolbar':
                    this._toolbarTemplate = item.template;
                    break;

                case 'chooseicon':
                    this._chooseIconTemplate = item.template;
                    break;

                case 'uploadicon':
                    this._uploadIconTemplate = item.template;
                    break;

                case 'cancelicon':
                    this._cancelIconTemplate = item.template;
                    break;

                case 'empty':
                    this._emptyTemplate = item.template;
                    break;

                case 'filelabel':
                    this._fileLabelTemplate = item.template;
                    break;

                default:
                    this._fileTemplate = item.template;
                    break;
            }
        });
    }

    basicFileChosenLabel() {
        if (this.auto()) return this.chooseButtonLabel;
        else if (this.hasFiles()) {
            if (this.files() && this.files().length === 1) return this.files()[0].name;

            return this.config.getTranslation('fileChosenMessage')?.replace('{0}', this.files().length);
        }

        return this.config.getTranslation('noFileChosenMessage') || '';
    }

    completedLabel() {
        return this.config.getTranslation('completed') || '';
    }

    getTranslation(option: string) {
        return this.config.getTranslation(option);
    }

    choose() {
        this.advancedFileInput()?.nativeElement.click();
    }

    onFileSelect(event: any) {
        if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
            this.duplicateIEEvent = false;
            return;
        }

        if (!this.multiple()) {
            this.files.set([]);
        }

        this.msgs = [];
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (!this.isFileSelected(file)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                    }

                    this.files().push(files[i]);
                }
            }
        }

        this.onSelect.emit({ originalEvent: event, files: files, currentFiles: this.files() });

        // this will check the fileLimit with the uploaded files
        this.checkFileLimit(files);

        if (this.hasFiles() && this.auto() && (this.mode() !== 'advanced' || !this.isFileLimitExceeded())) {
            this.upload();
        }

        if (event.type !== 'drop' && this.isIE11()) {
            this.clearIEInput();
        } else {
            this.clearInputElement();
        }
    }

    isFileSelected(file: File): boolean {
        for (let sFile of this.files()) {
            if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) {
                return true;
            }
        }

        return false;
    }

    isIE11() {
        if (isPlatformBrowser(this.platformId)) {
            return !!(this.document.defaultView as any)['MSInputMethodContext'] && !!(this.document as any)['documentMode'];
        }
    }

    validate(file: File): boolean {
        this.msgs = this.msgs || [];
        const accept = this.accept();
        if (accept && !this.isFileTypeValid(file)) {
            const text = `${this.invalidFileTypeMessageSummary().replace('{0}', file.name)} ${this.invalidFileTypeMessageDetail().replace('{0}', accept)}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
            return false;
        }

        const maxFileSize = this.maxFileSize();
        if (maxFileSize && file.size > maxFileSize) {
            const text = `${this.invalidFileSizeMessageSummary().replace('{0}', file.name)} ${this.invalidFileSizeMessageDetail().replace('{0}', this.formatSize(maxFileSize))}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
            return false;
        }

        return true;
    }

    private isFileTypeValid(file: File): boolean {
        let acceptableTypes = this.accept()?.split(',').map((type) => type.trim());
        for (let type of acceptableTypes!) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

            if (acceptable) {
                return true;
            }
        }

        return false;
    }

    getTypeClass(fileType: string): string {
        return fileType.substring(0, fileType.indexOf('/'));
    }

    isWildcard(fileType: string): boolean {
        return fileType.indexOf('*') !== -1;
    }

    getFileExtension(file: File): string {
        return '.' + file.name.split('.').pop();
    }

    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }

    onImageLoad(img: any) {
        window.URL.revokeObjectURL(img.src);
    }
    /**
     * Uploads the selected files.
     * @group Method
     */
    uploader() {
        if (this.customUpload()) {
            if (this.fileLimit()) {
                this.uploadedFileCount += this.files().length;
            }

            this.uploadHandler.emit({
                files: this.files()
            });

            this.cd.markForCheck();
        } else {
            this.uploading = true;
            this.msgs = [];
            let formData = new FormData();

            this.onBeforeUpload.emit({
                formData: formData
            });

            for (let i = 0; i < this.files().length; i++) {
                formData.append(this.name()!, this.files()[i], this.files()[i].name);
            }

            this.http
                .request(<string>this.method(), this.url() as string, {
                    body: formData,
                    headers: this.headers(),
                    reportProgress: true,
                    observe: 'events',
                    withCredentials: this.withCredentials()
                })
                .subscribe(
                    (event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Sent:
                                this.onSend.emit({
                                    originalEvent: event,
                                    formData: formData
                                });
                                break;
                            case HttpEventType.Response:
                                this.uploading = false;
                                this.progress = 0;

                                if (event['status'] >= 200 && event['status'] < 300) {
                                    if (this.fileLimit()) {
                                        this.uploadedFileCount += this.files().length;
                                    }

                                    this.onUpload.emit({ originalEvent: event, files: this.files() });
                                } else {
                                    this.onError.emit({ files: this.files() });
                                }
                                this.uploadedFiles = [...this.uploadedFiles, ...this.files()];
                                this.clear();
                                break;
                            case HttpEventType.UploadProgress: {
                                if (event['loaded']) {
                                    this.progress = Math.round((event['loaded'] * 100) / event['total']!);
                                }

                                this.onProgress.emit({ originalEvent: event, progress: this.progress });
                                break;
                            }
                        }

                        this.cd.markForCheck();
                    },
                    (error: ErrorEvent) => {
                        this.uploading = false;
                        this.onError.emit({ files: this.files(), error: error });
                    }
                );
        }
    }
    onRemoveClick(e: any) {
        const { event, index } = e;
        if (this.hasFiles()) {
            this.remove(event, index);
        }
    }
    onRemoveUploadedFileClick(e: any) {
        const { index } = e;
        if (this.hasUploadedFiles()) {
            this.removeUploadedFile(index);
        }
    }
    /**
     * Clears the files list.
     * @group Method
     */
    clear() {
        this.files.set([]);
        this.onClear.emit();
        this.clearInputElement();
        this.msgs = [];
        this.cd.markForCheck();
    }
    /**
     * Removes a single file.
     * @param {Event} event - Browser event.
     * @param {Number} index - Index of the file.
     * @group Method
     */
    remove(event: Event, index: number) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this.files()[index] });
        this.files().splice(index, 1);
        this.checkFileLimit(this.files());
    }
    /**
     * Removes uploaded file.
     * @param {Number} index - Index of the file to be removed.
     * @group Method
     */
    removeUploadedFile(index: number) {
        let removedFile = this.uploadedFiles.splice(index, 1)[0];
        this.uploadedFiles = [...this.uploadedFiles];
        this.onRemoveUploadedFile.emit({ file: removedFile, files: this.uploadedFiles });
    }

    isFileLimitExceeded() {
        const isAutoMode = this.auto();
        const totalFileCount = isAutoMode ? this.files().length : this.files().length + this.uploadedFileCount;

        const fileLimit = this.fileLimit();
        if (fileLimit && fileLimit <= totalFileCount && this.focus) {
            this.focus = false;
        }

        return fileLimit && fileLimit < totalFileCount;
    }

    isChooseDisabled() {
        if (this.auto()) {
            const fileLimit = this.fileLimit();
            return fileLimit && fileLimit <= this.files().length;
        } else {
            const fileLimit = this.fileLimit();
            return fileLimit && fileLimit <= this.files().length + this.uploadedFileCount;
        }
    }

    checkFileLimit(files: File[]) {
        this.msgs ??= [];
        const fileLimit = this.fileLimit();
        const hasExistingValidationMessages = this.msgs.length > 0 && fileLimit && fileLimit < files.length;

        if (this.isFileLimitExceeded() || hasExistingValidationMessages) {
            const text = `${this.invalidFileLimitMessageSummary().replace('{0}', (this.fileLimit() as number).toString())} ${this.invalidFileLimitMessageDetail().replace('{0}', (this.fileLimit() as number).toString())}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
        } else {
            this.msgs = this.msgs.filter((msg) => !msg.text.includes(this.invalidFileLimitMessageSummary()));
        }
    }

    clearInputElement() {
        if (this.advancedFileInput() && this.advancedFileInput()!.nativeElement) {
            this.advancedFileInput()!.nativeElement.value = '';
        }

        const basicFileInput = this.basicFileInput();
        if (basicFileInput && basicFileInput.nativeElement) {
            basicFileInput.nativeElement.value = '';
        }
    }

    clearIEInput() {
        if (this.advancedFileInput() && this.advancedFileInput()!.nativeElement) {
            this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
            this.advancedFileInput()!.nativeElement.value = '';
        }
    }

    hasFiles(): boolean {
        return this.files() && this.files().length > 0;
    }

    hasUploadedFiles() {
        return this.uploadedFiles && this.uploadedFiles.length > 0;
    }

    onDragEnter(e: DragEvent) {
        if (!this.disabled()) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragOver(e: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && addClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', true);
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragLeave(event: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
        }
    }

    onDrop(event: any) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
            event.stopPropagation();
            event.preventDefault();

            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple() || (files && files.length === 1);

            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }

    onFocus() {
        this.focus = true;
    }

    onBlur() {
        this.focus = false;
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }

    upload() {
        if (this.hasFiles()) this.uploader();
    }

    onBasicUploaderClick() {
        this.basicFileInput()?.nativeElement.click();
    }

    onBasicKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Space':
            case 'Enter':
                this.onBasicUploaderClick();

                event.preventDefault();
                break;
        }
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    get chooseButtonLabel(): string {
        return this.chooseLabel() || this.config.getTranslation(TranslationKeys.CHOOSE);
    }

    get uploadButtonLabel(): string {
        return this.uploadLabel() || this.config.getTranslation(TranslationKeys.UPLOAD);
    }

    get cancelButtonLabel(): string {
        return this.cancelLabel() || this.config.getTranslation(TranslationKeys.CANCEL);
    }

    get browseFilesLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)[TranslationKeys.BROWSE_FILES];
    }

    get pendingLabel() {
        return this.config.getTranslation(TranslationKeys.PENDING);
    }

    onDestroy() {
        const content = this.content();
        if (content && content.nativeElement) {
            if (this.dragOverListener) {
                this.dragOverListener();
                this.dragOverListener = null;
            }
        }

        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
    }
}

@NgModule({
    imports: [FileUpload, SharedModule],
    exports: [FileUpload, SharedModule]
})
export class FileUploadModule {}
