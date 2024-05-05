import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStudentExamCardComponent } from './details-student-exam-card.component';

describe('DetailsStudentExamCardComponent', () => {
  let component: DetailsStudentExamCardComponent;
  let fixture: ComponentFixture<DetailsStudentExamCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsStudentExamCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsStudentExamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
