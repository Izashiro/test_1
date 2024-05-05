import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioQuestionFieldComponent } from './radio-question-field.component';

describe('RadioQuestionFieldComponent', () => {
  let component: RadioQuestionFieldComponent;
  let fixture: ComponentFixture<RadioQuestionFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioQuestionFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioQuestionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
