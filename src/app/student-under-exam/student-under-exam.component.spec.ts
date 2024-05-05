import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentUnderExamComponent } from './student-under-exam.component';

describe('StudentUnderExamComponent', () => {
  let component: StudentUnderExamComponent;
  let fixture: ComponentFixture<StudentUnderExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentUnderExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentUnderExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
