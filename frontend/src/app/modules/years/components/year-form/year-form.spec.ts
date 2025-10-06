import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearForm } from './year-form';

describe('YearForm', () => {
  let component: YearForm;
  let fixture: ComponentFixture<YearForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
