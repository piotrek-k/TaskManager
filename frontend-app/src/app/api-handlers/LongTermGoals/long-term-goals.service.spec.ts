import { TestBed, inject } from '@angular/core/testing';

import { LongTermGoalsService } from './long-term-goals.service';

describe('LongTermGoalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LongTermGoalsService]
    });
  });

  it('should be created', inject([LongTermGoalsService], (service: LongTermGoalsService) => {
    expect(service).toBeTruthy();
  }));
});
