import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenceForm } from './competence-form';

describe('CompetenceForm', () => {
  let component: CompetenceForm;
  let fixture: ComponentFixture<CompetenceForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenceForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetenceForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
