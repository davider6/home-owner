import { TestBed } from '@angular/core/testing';

import { WorkersOccupationService } from './workers-occupation.service';

describe('WorkersOccupationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkersOccupationService = TestBed.get(WorkersOccupationService);
    expect(service).toBeTruthy();
  });
});
