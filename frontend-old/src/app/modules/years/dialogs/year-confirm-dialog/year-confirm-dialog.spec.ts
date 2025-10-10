import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearConfirmDialog } from './year-confirm-dialog';

describe('YearConfirmDialog', () => {
  let component: YearConfirmDialog;
  let fixture: ComponentFixture<YearConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearConfirmDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
