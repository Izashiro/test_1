import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextQuestionFieldComponent } from './text-question-field.component';

describe('TextQuestionFieldComponent', () => {
  let component: TextQuestionFieldComponent;
  let fixture: ComponentFixture<TextQuestionFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextQuestionFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextQuestionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
