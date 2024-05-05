import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqExamComponent } from './mcq-exam.component';

describe('McqExamComponent', () => {
  let component: McqExamComponent;
  let fixture: ComponentFixture<McqExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McqExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McqExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
