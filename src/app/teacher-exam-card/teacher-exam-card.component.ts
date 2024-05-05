import { Component, OnInit } from '@angular/core';
import { ExamService } from '../shared/exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Exam } from '../shared/exam.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teacher-exam-card',
  templateUrl: './teacher-exam-card.component.html',
  styleUrls: ['./teacher-exam-card.component.css']
})
export class TeacherExamCardComponent implements OnInit {

  constructor(private examService: ExamService, private userService: UserService, private router: Router, private toastr: ToastrService) { }
  userDetails = new User();
  exams: Exam[] = [];
  tempID : string = "";
  recipientEmail : string = "";
  selectedExam = new Exam();
  form!: FormGroup;
  month: string = "";
  file!: File;
  notificationCount!: number;
  months =  new Map([
    [1, "JAN"],
    [2, "FEB"],
    [3, "MAR"],
    [4, "APR"],
    [5, "MAY"],
    [6, "JUN"],
    [7, "JUL"],
    [8, "AUG"],
    [9, "SEP"],
    [10, "OCT"],
    [11, "NOV"],
    [12, "DEC"]
  ]);

  model = {
    examCode: '',
    recipiennt: ''
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        this.tempID = this.userDetails._id;
        this.examService.getExamList(this.tempID).subscribe( (res:any) =>{
          this.examService.exams = res as Exam[];
          this.exams = this.examService.exams;
        });
      },
      (err:any) => {}
    );

  }

  onClick(exam: Exam){
    this.selectedExam = JSON.parse(JSON.stringify(exam));
  }

  update(){
    this.examService.update(this.selectedExam, this.file).subscribe(
      (res:any) =>{
        this.toastr.success('Exam is updated');
        this.refreshExamList();
        this.resetForm();
      },
      err => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    )
  }

  refreshExamList(){
    this.examService.getExamList(this.tempID).subscribe( (res:any) =>{
      this.examService.exams = res as Exam[];
      this.exams = this.examService.exams;
    });
  }

  delete(){
    this.examService.deleteExam(this.selectedExam).subscribe( (res:any) =>{
      this.toastr.success('Exam is deleted')
      this.refreshExamList();
    },
    (err)=>{
      console.log('error in deleting: ' + JSON.stringify(err, undefined, 2));
    } )

  }

  uploadFile(event:any) {
    this.file = event.target.files[0];
  }

  createExam(){
    this.selectedExam.teacherID = this.userDetails._id;
    this.selectedExam.teacherName = this.userDetails.fullName;
    this.examService.postExam(this.selectedExam, this.file).subscribe(
      (res:any) => {
        this.toastr.success('Successfully exam is created')
        this.resetForm();
        this.refreshExamList();
      },
      (err:any) => {

      }
    )
  }

  invite(){
    this.model.examCode = this.selectedExam._id;
    this.model.recipiennt = this.recipientEmail;
    this.examService.invite(this.model).subscribe(
      (res:any) =>{
        this.toastr.success('Invitation sent');
        this.model.recipiennt = '';
      },
      (err) => {
        this.toastr.error('error in inviting: '+ err);
      }
    )
  }

  resetForm(){
    this.selectedExam.duration = 0;
    this.selectedExam.examName = "";
    this.selectedExam.examDate = "";
    this.selectedExam.startTime = "";
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    return this.months.get(parseInt(this.month));
  }

  viewMoreRouting(exam: Exam) {
    var tempUrl = 'teacher/examdetails/' + exam._id;
    this.router.navigateByUrl(tempUrl);
  }
}
