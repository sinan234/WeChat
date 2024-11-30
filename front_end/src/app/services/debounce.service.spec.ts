import { TestBed } from '@angular/core/testing';

import { DebounceService } from './debounce';

describe('DebounceService', () => {
  let service: DebounceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebounceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
