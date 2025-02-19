import { TestBed } from '@angular/core/testing';

import { DateTimeFormattingService } from './date-time-formatting.service';

describe('DateTimeFormattingService', () => {
  let service: DateTimeFormattingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeFormattingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
