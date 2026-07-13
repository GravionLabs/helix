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
