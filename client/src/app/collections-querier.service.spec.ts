import { TestBed, inject } from '@angular/core/testing';

import { CollectionsQuerierService } from './collections-querier.service';

describe('CollectionsQuerierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionsQuerierService]
    });
  });

  it('should be created', inject([CollectionsQuerierService], (service: CollectionsQuerierService) => {
    expect(service).toBeTruthy();
  }));
});
