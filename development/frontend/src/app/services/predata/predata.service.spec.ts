import { TestBed } from '@angular/core/testing';

import { PredataService } from './predata.service';

describe('PredataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PredataService = TestBed.get(PredataService);
    expect(service).toBeTruthy();
  });
});
