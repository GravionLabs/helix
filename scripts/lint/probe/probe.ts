// Lint probe (ADR 0006 of GravionLabs/skills, #1116): every line marked "probe:" breaks one rule on purpose.
// scripts/tests/lint-probe.spec.ts lints this folder and fails when oxlint (its Angular JS plugin, the helix plugin or
// the type-aware rules) or ESLint (the template rules) stops reporting one of them. Not imported anywhere, not part of
// a build, and left out of `pnpm lint`.
import type { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  type OnDestroy,
  Output,
} from '@angular/core';

@Component({
  selector: 'probe-component', // probe: @angular-eslint/component-selector
  standalone: false, // probe: @angular-eslint/prefer-standalone
  changeDetection: ChangeDetectionStrategy.Eager, // probe: @angular-eslint/prefer-on-push-component-change-detection
  templateUrl: './probe.html',
})
export class ProbeComponent implements OnDestroy {
  @Input() label = ''; // probe: helix/no-decorator-api
  @Output() readonly onPick = new EventEmitter<string>(); // probe: @angular-eslint/no-output-on-prefix
  @Output() readonly click = new EventEmitter<void>(); // probe: @angular-eslint/no-output-native

  constructor(readonly http: HttpClient) {} // probe: @angular-eslint/prefer-inject

  ngOnDestroy(): void {} // probe: @angular-eslint/no-empty-lifecycle-method

  pick(): void {
    Promise.resolve('pick').then((value) => this.onPick.emit(value)); // probe: typescript/no-floating-promises
  }
}
