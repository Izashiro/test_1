import { Component, ComponentRef, Input, OnInit, ViewChild } from '@angular/core';
import { QuestionCreatorDirective } from '../directives/question-creator.directive';
import { ComponentMap } from '../utils/componentMap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OptionsModalComponent } from './options-modal/options-modal.component';
import { QuestionCreationService } from '../services/question-creation.service';

@Component({
  selector: 'app-question-wrapper',
  templateUrl: './question-wrapper.component.html',
  styleUrls: ['./question-wrapper.component.css'],
})
export class QuestionWrapperComponent implements OnInit {
  @Input('examID') examID!: string;
  @Input('questions') questions!: any[];
  @ViewChild(QuestionCreatorDirective, { static: true })
  questionHost!: QuestionCreatorDirective;
  COMPONENT_MAP = new ComponentMap().COMPONENT_MAP;
  mainForm: FormGroup;
  componentRefs: ComponentRef<any>[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private questionService: QuestionCreationService
  ) {}

  ngOnInit(): void {
    this.mainForm = this.formBuilder.group({
      questionArray: this.formBuilder.array([]),
    });
  }

  populateInitialQuestion() {
    this.questionService
      .getMCQQuestion(this.examID)
      .subscribe((questions: any[]) => {
        questions.forEach(question => {
          this.addComponent(question.questionType, question);
        });
      });
  }

  removeFormGroup(index: number) {
    const questionArray = this.mainForm.get('questionArray') as FormArray;
    questionArray.removeAt(index);
  }

  ngAfterViewInit(): void {
    this.populateInitialQuestion();
    this.questionService.deleteEventEmitter.subscribe((index)=>{
      this.deleteComponent(index);
    })
  }

  deleteComponent(index: number) {
    const componentRef = this.componentRefs[index];
      componentRef.destroy();
      this.componentRefs.splice(index, 1);
      this.removeFormGroup(index);
      this.updateCurrentIndex();
  }
  get questionArray(): FormArray {
    return this.mainForm.get('questionArray') as FormArray;
  }

  updateCurrentIndex() {
    this.componentRefs.forEach((componentRef, i) => {
      componentRef.instance.index = i;
    });
  }

  removeQuestion(index: number) {
    this.questionArray.removeAt(index);
  }

  private createQuestionForm(questionType: string, question?: any): FormGroup {
    if (questionType == 'radio') {
      return this.formBuilder.group({
        question: [question?.question || '', Validators.required],
        options: this.formBuilder.array(
          question?.options || [],
          Validators.required
        ),
        fullMarks: [question?.fullMarks || '', Validators.required],
        correctAnswer: [question?.correctAnswer || '', Validators.required],
        questionType: 'radio',
      });
    } else
      return this.formBuilder.group({
        question: [question?.question || '', Validators.required],
        fullMarks: [question?.fullMarks || '', Validators.required],
        correctAnswer: [question?.correctAnswer || '', Validators.required],
        questionType: 'text',
      });
  }

  addComponent(componentType: string, question?: any) {
    const viewContainerRef = this.questionHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent<any>(
      this.COMPONENT_MAP[componentType]
    );
    const questionForm = this.createQuestionForm(componentType, question);
    componentRef.instance.questionForm = questionForm;
    componentRef.instance.index = this.questionArray.length;
    this.questionArray.push(questionForm);
    this.componentRefs.push(componentRef);
  }

  openModal() {
    const dialogRef = this.dialog.open(OptionsModalComponent);

    dialogRef.afterClosed().subscribe((questionType) => {
      this.addComponent(questionType);
    });
  }

  save() {
    console.log(this.mainForm.value);
    this.questionService
      .addMCQQuestion(this.examID, { mcqQuestion: this.mainForm.value })
      .subscribe((res) => {
        console.log('done');
      });
  }
}
