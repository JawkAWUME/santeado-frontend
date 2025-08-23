import { TestBed } from '@angular/core/testing';

import { Jitsi } from './jitsi';

describe('Jitsi', () => {
  let service: Jitsi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Jitsi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
