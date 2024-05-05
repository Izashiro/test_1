import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Status } from '../../utils/status';

@Component({
  selector: 'app-text-question-field',
  templateUrl: './text-question-field.component.html',
  styleUrls: ['./text-question-field.component.css']
})
export class TextQuestionFieldComponent implements OnInit {

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

}
