import { Component, ComponentRef, Input, OnInit, ViewChild } from '@angular/core';
import { QuestionCreationService } from 'src/app/question-creation/services/question-creation.service';
import { QuestionHostDirective } from '../directives/question-host.directive';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ComponentMap } from '../utils/componentMap';
import { Status } from '../utils/status';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-mcq-question-wrapper',
  templateUrl: './mcq-question-wrapper.component.html',
  styleUrls: ['./mcq-question-wrapper.component.css'],
})
export class McqQuestionWrapperComponent implements OnInit {
  @Input('examID') examID: string;
  questions: any[];
  @ViewChild(QuestionHostDirective, { static: true })
  questionHost!: QuestionHostDirective;
  mainForm: FormGroup;
  obtainedMarks !: number;
  COMPONENT_MAP = new ComponentMap().COMPONENT_MAP;
  STATUS = new Status().STATUS;
  componentRefs: ComponentRef<any>[] = [];
  totalMarks: number = 0;
  initialAnswer: any = [];

  constructor(
    private questionService: QuestionCreationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.mainForm = this.formBuilder.group({
      questionArray: this.formBuilder.array([]),
    });
    this.questionService.getMCQQuestion(this.examID)
    .pipe(
      switchMap((questions: any[]) => this.populateInitialAnswers().then(() => questions))
    )
    .subscribe((questions: any[]) => {
      questions.forEach((question, index) => {
        this.addComponent(question.questionType, index, question);
        this.totalMarks += question.fullMarks;
      });
    });
  }

  async populateInitialAnswers() {
    const res: any = await this.questionService.getMCQAnswer(this.examID).toPromise();
    if (res.answered) {
      this.initialAnswer = res.currentAnswer.mcqAnswer;
    }
  }

  private createQuestionForm(questionType: string, index: number): FormGroup {
    return this.formBuilder.group({
      [index]: this.initialAnswer[index]?.[index]==0 ? 0 : this.initialAnswer[index]?.[index] || '',
    });
  }

  get questionArray(): FormArray {
    return this.mainForm.get('questionArray') as FormArray;
  }

  addComponent(componentType: string, index?: number, question?: any) {
    const viewContainerRef = this.questionHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent<any>(
      this.COMPONENT_MAP[componentType]
    );
    const questionForm = this.createQuestionForm(componentType, index);
    componentRef.instance.questionForm = questionForm;
    componentRef.instance.question = question;
    componentRef.instance.index = this.questionArray.length;
    this.questionArray.push(questionForm);
    this.componentRefs.push(componentRef);
  }

  save() {
    console.log(JSON.stringify(this.mainForm.value.questionArray));
    this.questionService
      .addMCQAnswer(this.examID, {
        mcqAnswer: this.mainForm.value.questionArray,
      })
      .subscribe((res:any) => {
        let questions = res.question;
        let answers = this.mainForm.value.questionArray;
        console.log(questions, answers)
        questions.forEach((question, index)=>{
          this.componentRefs[index].instance.question = question;
          if(question.correctAnswer == answers[index][index]) {
            this.componentRefs[index].instance.status = this.STATUS.RIGHT;
          }
          else {
            this.componentRefs[index].instance.status = this.STATUS.WRONG;
          }
        })
        this.obtainedMarks = res.obtainedMarks;
      });
  }
}

