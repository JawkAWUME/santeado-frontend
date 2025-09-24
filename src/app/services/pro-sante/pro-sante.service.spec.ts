import { TestBed } from '@angular/core/testing';

import { ProSanteService } from './pro-sante.service';

describe('ProSanteService', () => {
  let service: ProSanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProSanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
