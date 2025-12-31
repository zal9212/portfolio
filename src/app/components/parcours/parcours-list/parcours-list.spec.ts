import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcoursList } from './parcours-list';

describe('ParcoursList', () => {
  let component: ParcoursList;
  let fixture: ComponentFixture<ParcoursList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcoursList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcoursList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
