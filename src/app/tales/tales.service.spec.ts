import { TestBed } from '@angular/core/testing';

import { TalesService } from './tales.service';

describe('TalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TalesService = TestBed.get(TalesService);
    expect(service).toBeTruthy();
  });
});
