import { TestBed, async, inject } from '@angular/core/testing';

import { SeasonsGuard } from './seasons.guard';

describe('SeasonsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeasonsGuard]
    });
  });

  it('should ...', inject([SeasonsGuard], (guard: SeasonsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
