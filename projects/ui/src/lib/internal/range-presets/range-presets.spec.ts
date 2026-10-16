import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { HxDateTimeRangePreset } from '../../date-range-presets/date-range-presets';
import { HxRangePresets } from './range-presets';

const preset = (label: string): HxDateTimeRangePreset => ({
  label,
  from: () => new Date(2026, 9, 1),
  to: () => new Date(2026, 9, 2),
});
const A = preset('Alpha');
const B = preset('Beta');

@Component({
  imports: [HxRangePresets],
  template: `
    <hx-range-presets
      [presets]="list"
      [display]="display()"
      label="Quick ranges"
      [disabled]="disabled()"
      [selected]="selected()"
      (chosen)="choose($event)"
    />
  `,
})
class Host {
  list = [A, B];
  display = signal<'buttons' | 'select'>('buttons');
  disabled = signal(false);
  selected = signal<HxDateTimeRangePreset | null>(null);
  /** Takes a choice (the picker accepting it) unless `refuse`. */
  refuse = false;
  chosen: HxDateTimeRangePreset[] = [];
  choose(p: HxDateTimeRangePreset): void {
    this.chosen.push(p);
    if (!this.refuse) this.selected.set(p);
  }
}

describe('HxRangePresets', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const root = () => fixture.nativeElement.querySelector('hx-range-presets') as HTMLElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const trigger = () => root().querySelector('.hx-select-trigger') as HTMLButtonElement;
  const pick = async (label: string) => {
    trigger().click();
    await settle();
    [...document.querySelectorAll<HTMLElement>('.hx-select-option')]
      .find((o) => o.textContent?.trim() === label)
      ?.click();
    await settle();
  };

  const scrollIntoView = Element.prototype.scrollIntoView;
  beforeEach(async () => {
    Element.prototype.scrollIntoView = () => {};
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });
  afterEach(() => {
    fixture.destroy();
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  it('is a named group of native buttons that report the preset', async () => {
    expect(root().getAttribute('role')).toBe('group');
    expect(root().getAttribute('aria-label')).toBe('Quick ranges');
    const buttons = [...root().querySelectorAll('button')];
    expect(buttons.map((b) => [b.type, b.textContent?.trim()])).toEqual([
      ['button', 'Alpha'],
      ['button', 'Beta'],
    ]);
    buttons[1].click();
    await settle();
    expect(host.chosen).toEqual([B]);
  });

  it('disables the buttons and the select', async () => {
    host.disabled.set(true);
    await settle();
    expect([...root().querySelectorAll('button')].every((b) => b.disabled)).toBe(true);
    host.display.set('select');
    await settle();
    expect(trigger().disabled).toBe(true);
  });

  it('is one select without the group role, showing the selected preset', async () => {
    host.display.set('select');
    await settle();
    expect(root().getAttribute('role')).toBeNull();
    expect(root().classList).toContain('hx-range-presets-select');
    expect(trigger().getAttribute('aria-label')).toBe('Quick ranges');
    expect(trigger().textContent?.trim()).toBe('Quick ranges');
    await pick('Beta');
    expect(host.chosen).toEqual([B]);
    expect(trigger().textContent?.trim()).toBe('Beta');
  });

  it('puts the select back when the picker refuses the choice', async () => {
    host.display.set('select');
    host.selected.set(A);
    await settle();
    host.refuse = true;
    await pick('Beta');
    expect(host.chosen).toEqual([B]);
    expect(trigger().textContent?.trim()).toBe('Alpha');
  });
});
