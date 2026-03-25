import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { GvMenu } from './menu';

describe('GvMenu', () => {
  let component: GvMenu;
  let fixture: ComponentFixture<GvMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvMenu],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GvMenu);
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
