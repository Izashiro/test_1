import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqQuestionWrapperComponent } from './mcq-question-wrapper.component';

describe('McqQuestionWrapperComponent', () => {
  let component: McqQuestionWrapperComponent;
  let fixture: ComponentFixture<McqQuestionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McqQuestionWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McqQuestionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
