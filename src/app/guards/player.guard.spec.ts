import { TestBed, async, inject } from '@angular/core/testing';

import { PlayerGuard } from './player.guard';

describe('PlayerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerGuard]
    });
  });

  it('should ...', inject([PlayerGuard], (guard: PlayerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
