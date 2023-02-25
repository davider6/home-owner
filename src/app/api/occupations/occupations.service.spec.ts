import { TestBed } from '@angular/core/testing';

import { OccupationsService } from './occupations.service';

describe('OccupationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OccupationsService = TestBed.get(OccupationsService);
    expect(service).toBeTruthy();
  });
});
