import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearFormDialog } from './year-form-dialog';

describe('YearFormDialog', () => {
  let component: YearFormDialog;
  let fixture: ComponentFixture<YearFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
