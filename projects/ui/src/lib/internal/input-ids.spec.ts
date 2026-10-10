import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HxAutoComplete } from '../auto-complete/auto-complete';
import { HxDatePicker } from '../date-picker/date-picker';
import { HxMultiSelect } from '../multi-select/multi-select';
import { HxSelect } from '../select/select';
import { HxSlider } from '../slider/slider';
import { HxToggleButton } from '../toggle-button/toggle-button';

@Component({
  imports: [HxAutoComplete, HxDatePicker, HxMultiSelect, HxSelect, HxSlider, HxToggleButton],
  template: `
    <hx-auto-complete ariaLabel="a" [suggestions]="[]" />
    <hx-date-picker ariaLabel="d" />
    <hx-multi-select ariaLabel="m" [options]="[]" />
    <hx-select ariaLabel="s" [options]="[]" />
    <hx-slider ariaLabel="v" />
    <hx-toggle-button ariaLabel="t" />
    <hx-select inputId="given" ariaLabel="given" [options]="[]" />
  `,
})
class Host {}

describe('inputId of the form controls', () => {
  it('leaves the id out when none is given (it must not become "null" or "undefined")', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('[id="null"], [id="undefined"]').length).toBe(0);
    expect(el.querySelector('#given')).toBeTruthy();
  });
});
