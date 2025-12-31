import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenceList } from './competence-list';

describe('CompetenceList', () => {
  let component: CompetenceList;
  let fixture: ComponentFixture<CompetenceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenceList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetenceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
