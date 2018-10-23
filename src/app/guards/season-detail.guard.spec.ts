import { TestBed, async, inject } from '@angular/core/testing';

import { SeasonDetailGuard } from './season-detail.guard';

describe('SeasonDetailGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeasonDetailGuard]
    });
  });

  it('should ...', inject([SeasonDetailGuard], (guard: SeasonDetailGuard) => {
    expect(guard).toBeTruthy();
  }));
});
