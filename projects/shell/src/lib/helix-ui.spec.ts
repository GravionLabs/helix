import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { HelixUi } from './helix-ui';

describe('HelixUi', () => {
  let component: HelixUi;
  let fixture: ComponentFixture<HelixUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixUi],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
