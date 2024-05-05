import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTeacherExamCardComponent } from './details-teacher-exam-card.component';

describe('DetailsTeacherExamCardComponent', () => {
  let component: DetailsTeacherExamCardComponent;
  let fixture: ComponentFixture<DetailsTeacherExamCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsTeacherExamCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTeacherExamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
