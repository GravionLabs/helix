import { Component } from '@angular/core';

/** Lint probe (#1116): an inline template outside a spec file fails component-max-inline-declarations. */
@Component({
  selector: 'hx-inline-template-probe',
  template: '<p>inline</p>', // probe: @angular-eslint/component-max-inline-declarations
})
export class InlineTemplateProbe {}
