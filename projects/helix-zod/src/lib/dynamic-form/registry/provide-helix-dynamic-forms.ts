import { type EnvironmentProviders, makeEnvironmentProviders, type Provider } from '@angular/core';
import type { HelixErrorMessageResolver } from '../errors/helix-signal-errors';
import { HelixArrayWidget } from '../widgets/array-widget/array-widget';
import { HelixCheckboxWidget } from '../widgets/checkbox-widget/checkbox-widget';
import { HelixDateWidget } from '../widgets/date-widget/date-widget';
import { HelixNumberWidget } from '../widgets/number-widget/number-widget';
import { HelixObjectWidget } from '../widgets/object-widget/object-widget';
import { HelixSelectWidget } from '../widgets/select-widget/select-widget';
import { HelixTextWidget } from '../widgets/text-widget/text-widget';
import { HelixTextareaWidget } from '../widgets/textarea-widget/textarea-widget';
import { HelixUnionWidget } from '../widgets/union-widget/union-widget';
import {
  HELIX_DYNAMIC_FIELD_WIDGETS,
  HELIX_ERROR_MESSAGE_RESOLVER,
  type HelixFieldWidgetRegistration,
} from './field-registry';

const BUILT_IN_WIDGETS: readonly HelixFieldWidgetRegistration[] = [
  { widget: 'text', component: HelixTextWidget },
  { widget: 'email', component: HelixTextWidget },
  { widget: 'password', component: HelixTextWidget },
  { widget: 'textarea', component: HelixTextareaWidget },
  { widget: 'number', component: HelixNumberWidget },
  { widget: 'checkbox', component: HelixCheckboxWidget },
  { widget: 'select', component: HelixSelectWidget },
  { widget: 'date', component: HelixDateWidget },
  { widget: 'object', component: HelixObjectWidget },
  { widget: 'array', component: HelixArrayWidget },
  { widget: 'union', component: HelixUnionWidget },
];

export interface HelixDynamicFormsConfig {
  /**
   * Additional widget registrations. Registered after the built-ins, so a
   * registration for an existing kind (e.g. `'select'`) overrides it.
   */
  widgets?: readonly HelixFieldWidgetRegistration[];
  /** Central override hook for user-facing error messages. */
  errorMessageResolver?: HelixErrorMessageResolver;
}

/**
 * Provides the dynamic-form widget registry (built-in widgets included) and
 * optional configuration. Add it to `ApplicationConfig.providers` or a route's
 * `providers`.
 */
export function provideHelixDynamicForms(
  config: HelixDynamicFormsConfig = {},
): EnvironmentProviders {
  const providers: Provider[] = [
    { provide: HELIX_DYNAMIC_FIELD_WIDGETS, multi: true, useValue: BUILT_IN_WIDGETS },
  ];
  if (config.widgets?.length) {
    providers.push({ provide: HELIX_DYNAMIC_FIELD_WIDGETS, multi: true, useValue: config.widgets });
  }
  if (config.errorMessageResolver) {
    providers.push({
      provide: HELIX_ERROR_MESSAGE_RESOLVER,
      useValue: config.errorMessageResolver,
    });
  }
  return makeEnvironmentProviders(providers);
}
