import { TestBed, async, inject } from '@angular/core/testing';

import { TeamsGuard } from './teams.guard';

describe('TeamsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamsGuard]
    });
  });

  it('should ...', inject([TeamsGuard], (guard: TeamsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
