import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { QuestionCreationService } from '../../services/question-creation.service';

@Component({
  selector: 'app-radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.css']
})
export class RadioQuestionComponent implements OnInit {

  @Input('questionForm') questionForm: FormGroup;
  @Input('index') index: number;

  constructor(private questionService: QuestionCreationService) { }

  ngOnInit() {
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    const prefix = String.fromCharCode(65 + this.options.length);
    this.options.push(new FormControl(''));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  check() {
    console.log(this.questionForm.value)
  }

  getOptionPrefix(index: number): string {
    return String.fromCharCode(65 + index);
  }

  deleteComponent() {
    this.questionService.deleteEventEmitter.emit(this.index);
  }
}


