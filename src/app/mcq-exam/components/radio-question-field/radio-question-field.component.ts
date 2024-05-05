import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Status } from '../../utils/status';

@Component({
  selector: 'app-radio-question-field',
  templateUrl: './radio-question-field.component.html',
  styleUrls: ['./radio-question-field.component.css']
})
export class RadioQuestionFieldComponent implements OnInit {

  STATUS = new Status().STATUS;
  @Input('questionForm') questionForm: FormGroup;
  @Input('question') question: any;
  @Input('index') index: number;
  @Input('status') status: number = this.STATUS.UNANSWERED;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log(this.status);
  }

  getOptionPrefix(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
