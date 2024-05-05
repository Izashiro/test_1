import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamCardComponent } from './student-exam-card.component';

describe('StudentExamCardComponent', () => {
  let component: StudentExamCardComponent;
  let fixture: ComponentFixture<StudentExamCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentExamCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentExamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
