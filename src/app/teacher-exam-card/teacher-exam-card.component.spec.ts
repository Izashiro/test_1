import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherExamCardComponent } from './teacher-exam-card.component';

describe('TeacherExamCardComponent', () => {
  let component: TeacherExamCardComponent;
  let fixture: ComponentFixture<TeacherExamCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherExamCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherExamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
