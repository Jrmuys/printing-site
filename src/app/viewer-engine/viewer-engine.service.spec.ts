import { TestBed } from '@angular/core/testing';

import { ViewerEngineService } from './viewer-engine.service';

describe('ViewerEngineService', () => {
  let service: ViewerEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewerEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
