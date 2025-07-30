import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avisocookies } from './avisocookies';

describe('Avisocookies', () => {
  let component: Avisocookies;
  let fixture: ComponentFixture<Avisocookies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avisocookies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avisocookies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
