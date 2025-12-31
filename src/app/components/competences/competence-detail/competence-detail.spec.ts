import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenceDetail } from './competence-detail';

describe('CompetenceDetail', () => {
  let component: CompetenceDetail;
  let fixture: ComponentFixture<CompetenceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenceDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetenceDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
