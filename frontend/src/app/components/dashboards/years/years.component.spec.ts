/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { YearsComponent } from './years.component';

describe('YearsComponent', () => {
  let component: YearsComponent;
  let fixture: ComponentFixture<YearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
