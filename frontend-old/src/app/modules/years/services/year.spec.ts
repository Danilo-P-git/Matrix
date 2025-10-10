import { TestBed } from '@angular/core/testing';

import { Year } from './year';

describe('Year', () => {
  let service: Year;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Year);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
