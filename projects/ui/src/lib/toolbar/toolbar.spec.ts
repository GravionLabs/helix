import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxToolbar } from './toolbar';

@Component({
  imports: [HxToolbar],
  template: `
    <hx-toolbar id="full">
      <button hxToolbarStart type="button" id="new">New</button>
      <span hxToolbarCenter>3 selected</span>
      <button hxToolbarEnd type="button" id="export">Export</button>
    </hx-toolbar>
    <hx-toolbar id="start"><button hxToolbarStart type="button">Only start</button></hx-toolbar>
  `,
})
class Host {}

describe('HxToolbar', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('projects start, center and end content into their areas', () => {
    expect(el('full').querySelector('.hx-toolbar-start #new')).toBeTruthy();
    expect(el('full').querySelector('.hx-toolbar-center')?.textContent?.trim()).toBe('3 selected');
    expect(el('full').querySelector('.hx-toolbar-end #export')).toBeTruthy();
  });

  it('has no toolbar role and leaves each control its own tab stop', () => {
    expect(el('full').getAttribute('role')).toBeNull();
    const buttons = el('full').querySelectorAll('button');
    expect([...buttons].every((b) => b.tabIndex === 0)).toBe(true);
  });

  it('leaves unused areas empty so they can be hidden', () => {
    expect(el('start').querySelector('.hx-toolbar-center')?.childNodes.length).toBe(0);
    expect(el('start').querySelector('.hx-toolbar-end')?.childNodes.length).toBe(0);
  });
});
