import { TestBed } from '@angular/core/testing';

import { PhoneRegexService } from './phone.regex.service';

describe('PhoneRegexService', () => {
  let service: PhoneRegexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneRegexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
