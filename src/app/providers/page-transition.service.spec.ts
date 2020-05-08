import { TestBed } from '@angular/core/testing';

import { PageTransitionService } from './page-transition.service';

describe('PageTransitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageTransitionService = TestBed.get(PageTransitionService);
    expect(service).toBeTruthy();
  });
});
