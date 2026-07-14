# FileUpload

> FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.

## Import

```ts
import { FileUpload, FileContent } from '@gravionlabs/helix/fileupload';
```

## Components

### FileUpload

Selector: `h-fileupload, h-fileUpload`

FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string \| undefined` | — | Name of the request parameter to identify the files at backend. |
| `url` | `string \| undefined` | — | Remote url to upload the files. |
| `method` | `'post' \| 'put' \| undefined` | `'post'` | HTTP method to send the files to the url such as "post" and "put". |
| `multiple` | `boolean \| undefined` | — | Used to select multiple files at once from file dialog. |
| `accept` | `string \| undefined` | — | Comma-separated list of pattern to restrict the allowed file types. Can be any combination of either the MIME types (such as "image/*") or the file extensions (such as ".jpg"). |
| `disabled` | `boolean \| undefined` | — | Disables the upload functionality. |
| `auto` | `boolean \| undefined` | — | When enabled, upload begins automatically after selection is completed. |
| `withCredentials` | `boolean \| undefined` | — | Cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. |
| `maxFileSize` | `number \| undefined` | — | Maximum file size allowed in bytes. |
| `invalidFileSizeMessageSummary` | `string` | `'{0}: Invalid file size, '` | Summary message of the invalid file size. |
| `invalidFileSizeMessageDetail` | `string` | `'maximum upload size is {0}.'` | Detail message of the invalid file size. |
| `invalidFileTypeMessageSummary` | `string` | `'{0}: Invalid file type, '` | Summary message of the invalid file type. |
| `invalidFileTypeMessageDetail` | `string` | `'allowed file types: {0}.'` | Detail message of the invalid file type. |
| `invalidFileLimitMessageDetail` | `string` | `'limit is {0} at most.'` | Detail message of the invalid file type. |
| `invalidFileLimitMessageSummary` | `string` | `'Maximum number of files exceeded, '` | Summary message of the invalid file type. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the element. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `previewWidth` | `number` | `50` | Width of the image thumbnail in pixels. |
| `chooseLabel` | `string \| undefined` | — | Label of the choose button. Defaults to PrimeNG Locale configuration. |
| `uploadLabel` | `string \| undefined` | — | Label of the upload button. Defaults to PrimeNG Locale configuration. |
| `cancelLabel` | `string \| undefined` | — | Label of the cancel button. Defaults to PrimeNG Locale configuration. |
| `chooseIcon` | `string \| undefined` | — | Icon of the choose button. |
| `uploadIcon` | `string \| undefined` | — | Icon of the upload button. |
| `cancelIcon` | `string \| undefined` | — | Icon of the cancel button. |
| `showUploadButton` | `boolean` | `true` | Whether to show the upload button. |
| `showCancelButton` | `boolean` | `true` | Whether to show the cancel button. |
| `mode` | `'advanced' \| 'basic' \| undefined` | `'advanced'` | Defines the UI of the component. |
| `headers` | `HttpHeaders \| undefined` | — | HttpHeaders class represents the header configuration options for an HTTP request. |
| `customUpload` | `boolean \| undefined` | — | Whether to use the default upload or a manual implementation defined in uploadHandler callback. Defaults to PrimeNG Locale configuration. |
| `fileLimit` | `number \| undefined` | — | Maximum number of files that can be uploaded. |
| `uploadStyleClass` | `string \| undefined` | — | Style class of the upload button. |
| `cancelStyleClass` | `string \| undefined` | — | Style class of the cancel button. |
| `removeStyleClass` | `string \| undefined` | — | Style class of the remove button. |
| `chooseStyleClass` | `string \| undefined` | — | Style class of the choose button. |
| `chooseButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the choose button inside the component. |
| `uploadButtonProps` | `ButtonProps` | `{ severity: 'secondary' }` | Used to pass all properties of the ButtonProps to the upload button inside the component. |
| `cancelButtonProps` | `ButtonProps` | `{ severity: 'secondary' }` | Used to pass all properties of the ButtonProps to the cancel button inside the component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeUpload` | `EventEmitter&lt;FileBeforeUploadEvent&gt;` | Callback to invoke before file upload is initialized. |
| `onSend` | `EventEmitter&lt;FileSendEvent&gt;` | An event indicating that the request was sent to the server. Useful when a request may be retried multiple times, to distinguish between retries on the final event stream. |
| `onUpload` | `EventEmitter&lt;FileUploadEvent&gt;` | Callback to invoke when file upload is complete. |
| `onError` | `EventEmitter&lt;FileUploadErrorEvent&gt;` | Callback to invoke if file upload fails. |
| `onClear` | `EventEmitter&lt;Event&gt;` | Callback to invoke when files in queue are removed without uploading using clear all button. |
| `onRemove` | `EventEmitter&lt;FileRemoveEvent&gt;` | Callback to invoke when a file is removed without uploading using clear button of a file. |
| `onSelect` | `EventEmitter&lt;FileSelectEvent&gt;` | Callback to invoke when files are selected. |
| `onProgress` | `EventEmitter&lt;FileProgressEvent&gt;` | Callback to invoke when files are being uploaded. |
| `uploadHandler` | `EventEmitter&lt;FileUploadHandlerEvent&gt;` | Callback to invoke in custom upload mode to upload the files manually. |
| `onImageError` | `EventEmitter&lt;Event&gt;` | This event is triggered if an error occurs while loading an image file. |
| `onRemoveUploadedFile` | `EventEmitter&lt;RemoveUploadedFileEvent&gt;` | This event is triggered if an error occurs while loading an image file. |

### FileContent

Selector: `[hFileContent]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `files` | `any` | — | — |
| `badgeSeverity` | `'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast'` | `'warn'` | — |
| `badgeValue` | `string` | — | — |
| `previewWidth` | `number` | `50` | — |
| `fileRemoveIconTemplate` | `any` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onRemove` | `any` | — |

## Source

[`projects/helix/fileupload`](../../projects/helix/fileupload)
