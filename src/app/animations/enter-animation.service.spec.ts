import { TestBed } from '@angular/core/testing';

import { EnterAnimationService } from './enter-animation.service';

describe('EnterAnimationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnterAnimationService = TestBed.get(EnterAnimationService);
    expect(service).toBeTruthy();
  });
});
