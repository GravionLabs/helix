import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { HelixMenu } from './menu';

describe('HelixMenu', () => {
  let component: HelixMenu;
  let fixture: ComponentFixture<HelixMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixMenu],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default model as empty array', () => {
    expect(component.model()).toEqual([]);
  });

  it('should reflect custom model input', () => {
    const model: MenuItem[] = [{ label: 'Home' }, { label: 'About' }];
    fixture.componentRef.setInput('model', model);
    fixture.detectChanges();
    expect(component.model()).toEqual(model);
  });
});
