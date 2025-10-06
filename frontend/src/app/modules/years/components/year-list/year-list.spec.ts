import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearList } from './year-list';

describe('YearList', () => {
  let component: YearList;
  let fixture: ComponentFixture<YearList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
