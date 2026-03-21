import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SakaiUi } from './sakai-ui';

describe('SakaiUi', () => {
  let component: SakaiUi;
  let fixture: ComponentFixture<SakaiUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SakaiUi],
    }).compileComponents();

    fixture = TestBed.createComponent(SakaiUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
