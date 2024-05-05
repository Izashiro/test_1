import { Component, Input, OnInit } from '@angular/core';
import { QuestionCreationService } from '../question-creation/services/question-creation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mcq-exam',
  templateUrl: './mcq-exam.component.html',
  styleUrls: ['./mcq-exam.component.css']
})
export class McqExamComponent implements OnInit {

  @Input('examID') examID!: string;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.examID = params.get('id');
    });
  }

  

}
