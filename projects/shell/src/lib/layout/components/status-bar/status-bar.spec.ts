import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixStatusBar } from './status-bar';

describe('HelixStatusBar', () => {
  let component: HelixStatusBar;
  let fixture: ComponentFixture<HelixStatusBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixStatusBar],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixStatusBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default tone neutral', () => {
    expect(component.tone()).toBe('neutral');
  });

  it('should reflect brand input', () => {
    fixture.componentRef.setInput('brand', 'MyApp');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.helix-status-bar-brand');
    expect(el.textContent).toContain('MyApp');
  });

  it('should render environment badge when set', () => {
    fixture.componentRef.setInput('environment', 'testing');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.helix-badge__label');
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('Testing');
  });

  it('should render a custom environment label and severity', () => {
    fixture.componentRef.setInput('environment', { label: 'Canary', severity: 'error' });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.helix-badge__label')?.textContent).toBe('Canary');
    expect(el.querySelector('.helix-badge--error')).not.toBeNull();
  });

  it('should render Unknown for an unrecognised environment string', () => {
    fixture.componentRef.setInput('environment', 'qa-7');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.helix-badge__label')?.textContent).toBe('Unknown');
  });

  it('should render no badge for an empty environment string', () => {
    fixture.componentRef.setInput('environment', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('helix-environment-badge')).toBeNull();
  });

  it('should render note when set', () => {
    fixture.componentRef.setInput('note', 'Build #1234');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.helix-status-bar-note');
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('Build #1234');
  });

  it('should render versions', () => {
    fixture.componentRef.setInput('versions', [
      { label: 'UI', value: '2.1.0' },
      { label: 'API', value: '3.0.1' },
    ]);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.helix-status-bar-version');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('UI:');
    expect(items[0].textContent).toContain('2.1.0');
  });

  it('should apply tone background color', () => {
    fixture.componentRef.setInput('tone', 'staging');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.helix-status-bar');
    const bg = el.style.backgroundColor;
    expect(bg).toBeTruthy();
  });

  it('should reflect custom height', () => {
    fixture.componentRef.setInput('height', '3rem');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.helix-status-bar');
    expect(el.style.height).toBe('3rem');
  });
});

@Component({
  imports: [HelixStatusBar],
  template: `
    <ng-template #tpl>See <a href="/notes">release notes</a></ng-template>
    <helix-status-bar [note]="useTemplate() ? tpl : 'Build #1'" [versions]="[{ label: 'UI', value: '1.0' }]">
      @if (withEnd()) {
        <button hxStatusBarEnd type="button">Feedback</button>
      }
    </helix-status-bar>
  `,
})
class HostComponent {
  useTemplate = signal(false);
  withEnd = signal(true);
}

describe('HelixStatusBar slots', () => {
  let fixture: ComponentFixture<HostComponent>;

  function setup(useTemplate: boolean, withEnd = true) {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.useTemplate.set(useTemplate);
    fixture.componentInstance.withEnd.set(withEnd);
    fixture.detectChanges();
    fixture.detectChanges();
  }

  beforeEach(() => TestBed.configureTestingModule({ imports: [HostComponent] }));

  it('renders the end slot inside the bar, after the versions', () => {
    setup(false);
    const bar: HTMLElement = fixture.nativeElement.querySelector('.helix-status-bar');
    const end = bar.querySelector('.helix-status-bar-end') as HTMLElement;
    const versions = bar.querySelector('.helix-status-bar-versions') as HTMLElement;
    expect(end.querySelector('button')?.textContent).toContain('Feedback');
    expect(versions.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('leaves the end container empty when nothing is projected', () => {
    setup(false, false);
    const end = fixture.nativeElement.querySelector('.helix-status-bar-end') as HTMLElement;
    expect(end.children.length).toBe(0);
    expect(Array.from(end.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE)).toEqual([]);
  });

  it('renders a TemplateRef note including its link', () => {
    setup(true);
    const note = fixture.nativeElement.querySelector('.helix-status-bar-note') as HTMLElement;
    expect(note.textContent).toContain('See');
    expect(note.querySelector('a')?.getAttribute('href')).toBe('/notes');
  });

  it('still renders a string note as text', () => {
    setup(false);
    const note = fixture.nativeElement.querySelector('.helix-status-bar-note') as HTMLElement;
    expect(note.textContent?.trim()).toBe('Build #1');
    expect(note.querySelector('a')).toBeNull();
  });

  it('switches the note between string and TemplateRef at runtime', () => {
    setup(false);
    const note = () => fixture.nativeElement.querySelector('.helix-status-bar-note') as HTMLElement;
    fixture.componentInstance.useTemplate.set(true);
    fixture.detectChanges();
    expect(note().querySelector('a')).not.toBeNull();
    fixture.componentInstance.useTemplate.set(false);
    fixture.detectChanges();
    expect(note().querySelector('a')).toBeNull();
    expect(note().textContent?.trim()).toBe('Build #1');
  });
});
