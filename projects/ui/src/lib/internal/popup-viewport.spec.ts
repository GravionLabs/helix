import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import type { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxDatePicker } from '../date-picker/date-picker';
import { HxDateRangeQuickSelect } from '../date-range-quick-select/date-range-quick-select';
import { HxDateTimePicker } from '../date-time-picker/date-time-picker';
import { HxDateTimeRangePicker } from '../date-time-range-picker/date-time-range-picker';
import { HxTimePicker } from '../time-picker/time-picker';

/** A popup that does not fit next to its field (a narrow screen) is pushed back into the viewport. */
describe('date and time popups', () => {
  it.each<[string, Type<unknown>]>([
    ['hx-date-picker', HxDatePicker],
    ['hx-date-time-picker', HxDateTimePicker],
    ['hx-time-picker', HxTimePicker],
    ['hx-date-time-range-picker', HxDateTimeRangePicker],
    ['hx-date-range-quick-select', HxDateRangeQuickSelect],
  ])('%s pushes its popup into the viewport', (_name, component) => {
    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    const [overlay] = fixture.debugElement.queryAllNodes(By.directive(CdkConnectedOverlay));
    expect(overlay.injector.get(CdkConnectedOverlay).push).toBe(true);
  });
});
