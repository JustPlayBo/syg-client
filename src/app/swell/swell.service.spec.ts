import { TestBed } from '@angular/core/testing';

import { SwellService } from './swell.service';

describe('SwellService', () => {
  let service: SwellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
