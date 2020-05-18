import { TestBed } from '@angular/core/testing';

import { SygService } from './syg.service';

describe('SygService', () => {
  let service: SygService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SygService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
