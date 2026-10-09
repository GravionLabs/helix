import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HxStep,
  HxStepContent,
  HxStepList,
  HxStepPanel,
  HxStepPanels,
  HxStepper,
  type HxStepValue,
} from './stepper';

@Component({
  imports: [HxStepper, HxStepList, HxStep, HxStepPanels, HxStepPanel, HxStepContent],
  template: `
    <hx-stepper #stepper id="s" [(value)]="value" [linear]="linear()" [keepAlive]="keepAlive()">
      <hx-step-list>
        <hx-step [value]="1">One</hx-step>
        <hx-step [value]="2">Two</hx-step>
        <hx-step [value]="3" disabled>Three</hx-step>
        <hx-step [value]="4">Four</hx-step>
      </hx-step-list>
      <hx-step-panels>
        <hx-step-panel [value]="1">
          <ng-template hxStepContent let-activateCallback="activateCallback" let-value="value">
            <span class="one">one {{ value }}</span>
            <button id="go" (click)="activateCallback(2)">go</button>
          </ng-template>
        </hx-step-panel>
        <hx-step-panel [value]="2"><span class="two">two</span></hx-step-panel>
        <hx-step-panel [value]="3">three</hx-step-panel>
        <hx-step-panel [value]="4">four</hx-step-panel>
      </hx-step-panels>
    </hx-stepper>
    <button id="next" (click)="stepper.next()">next</button>
    <button id="prev" (click)="stepper.previous()">prev</button>
  `,
})
class Host {
  value = signal<HxStepValue | null>(null);
  linear = signal(false);
  keepAlive = signal(false);
}

describe('HxStepper', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const root = () => fixture.nativeElement as HTMLElement;
  const q = (s: string) => root().querySelector<HTMLElement>(s);
  const headers = () => [...root().querySelectorAll<HTMLButtonElement>('.hx-step-header')];
  const steps = () => [...root().querySelectorAll<HTMLElement>('hx-step')];
  const panels = () => [...root().querySelectorAll<HTMLElement>('hx-step-panel')];
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('starts at the first enabled step and numbers the headers', () => {
    expect(host.value()).toBe(1);
    expect(headers().map((h) => h.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      '1 One',
      '2 Two',
      '3 Three',
      '4 Four',
    ]);
    expect(steps().map((s) => s.getAttribute('role'))).toEqual(Array(4).fill('listitem'));
    expect(q('hx-step-list')?.getAttribute('role')).toBe('list');
  });

  it('marks the active step with aria-current and shows only its panel', () => {
    expect(headers().map((h) => h.getAttribute('aria-current'))).toEqual([
      'step',
      null,
      null,
      null,
    ]);
    expect(panels().map((p) => p.hidden)).toEqual([false, true, true, true]);
    expect(panels()[0].getAttribute('role')).toBe('region');
    expect(panels()[0].getAttribute('aria-labelledby')).toBe(headers()[0].id);
    expect(headers()[0].getAttribute('aria-controls')).toBe(panels()[0].id);
  });

  it('activates a step from its header; completed steps show a check', async () => {
    headers()[1].click();
    await settle();
    expect(host.value()).toBe(2);
    expect(steps()[0].classList).toContain('hx-step-completed');
    expect(steps()[0].querySelector('.hx-step-check')).toBeTruthy();
    expect(steps()[1].classList).toContain('hx-step-active');
    expect(panels().map((p) => p.hidden)).toEqual([true, false, true, true]);
  });

  it('disables a disabled step and draws no separator after the last step', () => {
    expect(headers()[2].disabled).toBe(true);
    expect(steps()[3].classList).toContain('hx-step-last');
    expect(steps()[3].querySelector('.hx-step-separator')).toBeNull();
    expect(steps()[0].querySelector('.hx-step-separator')).toBeTruthy();
  });

  it('disables the steps after the active one when linear, and activateCallback moves on', async () => {
    host.linear.set(true);
    await settle();
    expect(headers().map((h) => h.disabled)).toEqual([false, true, true, true]);
    headers()[3].click();
    await settle();
    expect(host.value()).toBe(1);
    (q('#go') as HTMLElement).click();
    await settle();
    expect(host.value()).toBe(2);
    expect(headers().map((h) => h.disabled)).toEqual([false, false, true, true]);
    headers()[0].click(); // back
    await settle();
    expect(host.value()).toBe(1);
  });

  it('creates lazy content when first shown, destroys it when left unless keepAlive', async () => {
    expect(q('.one')?.textContent).toBe('one 1');
    headers()[1].click();
    await settle();
    expect(q('.one')).toBeNull();
    host.keepAlive.set(true);
    headers()[0].click();
    await settle();
    headers()[1].click();
    await settle();
    expect(q('.one')).toBeTruthy();
  });

  it('keeps plain panel content in the DOM, hidden', () => {
    expect(q('.two')).toBeTruthy();
    expect(panels()[1].hidden).toBe(true);
  });

  it('moves with next() and previous() and stops at the ends', async () => {
    (q('#next') as HTMLElement).click();
    await settle();
    expect(host.value()).toBe(2);
    (q('#prev') as HTMLElement).click();
    (q('#prev') as HTMLElement).click();
    await settle();
    expect(host.value()).toBe(1);
  });
});
