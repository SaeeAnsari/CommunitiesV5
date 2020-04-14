import { TestBed } from '@angular/core/testing';

import { LeaveAnimationService } from './leave-animation.service';

describe('LeaveAnimationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeaveAnimationService = TestBed.get(LeaveAnimationService);
    expect(service).toBeTruthy();
  });
});
