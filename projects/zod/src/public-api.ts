/*
 * Public API Surface of @gravionlabs/helix-zod
 */

// Dynamic forms — components
export { HelixDynamicField } from './lib/dynamic-form/components/dynamic-field/dynamic-field';
export { HelixDynamicForm } from './lib/dynamic-form/components/dynamic-form/dynamic-form';
// Dynamic forms — errors
export type { HelixErrorMessageResolver } from './lib/dynamic-form/errors/helix-signal-errors';
export {
  helixErrorKey,
  helixFirstErrorMessage,
} from './lib/dynamic-form/errors/helix-signal-errors';

// Dynamic forms — schema engine
export type { HelixFieldDescriptor } from './lib/dynamic-form/model/helix-field-descriptor';
// Dynamic forms — metadata
export type {
  HelixFieldMeta,
  HelixSelectOption,
  HelixWidgetKind,
} from './lib/dynamic-form/model/helix-field-meta';
export {
  helixFieldMetaRegistry,
  helixMeta,
  readHelixMeta,
} from './lib/dynamic-form/model/helix-field-meta';
// Dynamic forms — registry & provider
export type { HelixFieldWidgetRegistration } from './lib/dynamic-form/registry/field-registry';
export {
  HELIX_DYNAMIC_FIELD_WIDGETS,
  HELIX_ERROR_MESSAGE_RESOLVER,
  HelixFieldWidgetResolver,
} from './lib/dynamic-form/registry/field-registry';
export type { HelixDynamicFormsConfig } from './lib/dynamic-form/registry/provide-helix-dynamic-forms';
export { provideHelixDynamicForms } from './lib/dynamic-form/registry/provide-helix-dynamic-forms';
export { fieldAtPath } from './lib/dynamic-form/schema/field-path.utils';
export { buildHelixSchema } from './lib/dynamic-form/schema/signal-schema-builder';
export { buildDefaultValue } from './lib/dynamic-form/schema/zod-defaults';
export { zodToFieldDescriptors } from './lib/dynamic-form/schema/zod-field-walker';
export { HelixArrayWidget } from './lib/dynamic-form/widgets/array-widget/array-widget';
export { HelixCheckboxWidget } from './lib/dynamic-form/widgets/checkbox-widget/checkbox-widget';
export { HelixDateInput } from './lib/dynamic-form/widgets/date-widget/date-input';
export { HelixDateWidget } from './lib/dynamic-form/widgets/date-widget/date-widget';
export { HelixNumberWidget } from './lib/dynamic-form/widgets/number-widget/number-widget';
export { HelixObjectWidget } from './lib/dynamic-form/widgets/object-widget/object-widget';
export { HelixSelectWidget } from './lib/dynamic-form/widgets/select-widget/select-widget';
export { HelixTextWidget } from './lib/dynamic-form/widgets/text-widget/text-widget';
export { HelixTextareaWidget } from './lib/dynamic-form/widgets/textarea-widget/textarea-widget';
export { HelixUnionWidget } from './lib/dynamic-form/widgets/union-widget/union-widget';
// Dynamic forms — widgets
export { HelixFieldWidgetBase } from './lib/dynamic-form/widgets/widget-base';
// Reactive-forms bridge
export type { ZodHelixOptions } from './lib/helix-zod-validators';
export { HelixZodValidators } from './lib/helix-zod-validators';
