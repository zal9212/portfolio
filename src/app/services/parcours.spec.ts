import { TestBed } from '@angular/core/testing';

import { Parcours } from './parcours';

describe('Parcours', () => {
  let service: Parcours;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Parcours);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
