import { TestBed } from '@angular/core/testing';

import { TeleconsultationService } from './teleconsultation.service';

describe('TeleconsultationService', () => {
  let service: TeleconsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeleconsultationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
