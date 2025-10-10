import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearDetail } from './year-detail';

describe('YearDetail', () => {
  let component: YearDetail;
  let fixture: ComponentFixture<YearDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
