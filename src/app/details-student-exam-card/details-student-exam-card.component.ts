import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { StudentExamService } from '../shared/student-exam.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { MyNotification } from '../shared/notification.model';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-details-student-exam-card',
  templateUrl: './details-student-exam-card.component.html',
  styleUrls: ['./details-student-exam-card.component.css']
})
export class DetailsStudentExamCardComponent implements OnInit {

  month: string = "";
  participants: User[] = [];
  tempUser = new User();
  participantSet = new Set<string>();
  currentExamCode: string = '';
  currentExam = new Exam();
  tempExamDate: string = "";
  tempRemainingTime: number = 0;

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

  id: string = '';
  tempID: string = '';
  model ={
    examCode: '',
    userID: '',
    examName: ''
  }

  remDay: any;
  remHour: any;
  remMinute: any;
  remSecond: any;
  hide: Boolean = false;

  constructor(private toastr: ToastrService, private userService: UserService,  private studentExamService: StudentExamService, private route: ActivatedRoute, private router: Router, private examService: ExamService) { }
  examDetails = new Exam();
  userDetails = new User();

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    this.studentExamService.getSingleExamDetails(this.id).subscribe(
      (res:any) => {
        this.examDetails = res as Exam;
        if(this.userDetails.isTeacher){
          this.router.navigateByUrl('dashboard');
        }
        setInterval(()=>{
          const date = new Date();
          this.clockDown(date);

        },500);
        this.refreshParticipantList();
      },
      err => {}
    );
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        this.tempID = this.userDetails._id;
        this.model.userID = this.userDetails._id;
    });
  }

  examGoingOn(givenExam: Exam){
    this.tempExamDate = givenExam.examDate + 'T' + givenExam.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    if(this.tempRemainingTime>0) return false;
    return this.tempRemainingTime + givenExam.duration*60*1000 > 0;
  }

  onLeaveClick(givenExam: Exam){
    this.currentExamCode = givenExam._id;
    this.model.examCode = givenExam._id;
    this.model.examName = givenExam.examName;
    this.currentExam = givenExam;
  }

  leaveExam(){
    this.studentExamService.leaveExam(this.model, this.model.examCode).subscribe(
      (res:any) =>{
        this.toastr.error("Successfully left the exam.")
        this.router.navigateByUrl('dashboard');
      },
      (err:any) => {
        console.log('Error in updating exam: '+ JSON.stringify(err, undefined, 2));
      }
    );
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamMonth(input: string): any{
    this.month = input.substring(5,7);
    return this.months.get(parseInt(this.month));
  }

  refreshParticipantList(){
    this.participantSet = new Set<string>();
    this.participants = [];
    this.examDetails.participants.forEach(participantID => {
      this.participantSet.add(participantID);
    });
    this.participantSet.forEach(participantID => {
      this.examService.getParticipant(participantID).subscribe(
        (res:any) => {
          this.tempUser = res as User;
          this.participants.push(JSON.parse(JSON.stringify(this.tempUser)));
        },
        (err:any) => {}
      );
    });
  }

  clockDown(date:Date) {
    this.tempExamDate = this.examDetails.examDate + 'T' + this.examDetails.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();

    if (this.tempRemainingTime < 5 * 60 * 1000 && this.tempRemainingTime >= 0) {
      this.hide = !this.hide;
    }

    if (this.tempRemainingTime < 0) {
      this.hide = false;
      this.remDay = "00";
      this.remHour = "00";
      this.remMinute = "00";
      this.remSecond = "00";
    }
    else {
      this.remSecond = Math.floor(this.tempRemainingTime / 1000);
      this.remMinute = Math.floor(this.remSecond / 60);
      this.remHour = Math.floor(this.remMinute / 60);

      this.remMinute %= 60;
      this.remSecond %= 60;
      this.remHour = this.remHour < 10 ? '0' + this.remHour : this.remHour;
      this.remMinute = this.remMinute < 10 ? '0' + this.remMinute : this.remMinute;
      this.remSecond = this.remSecond < 10 ? '0' + this.remSecond : this.remSecond;
    }
  }

  examStart(currentExam: Exam){
    this.examService.selectedExam = currentExam;
    this.router.navigateByUrl('student/exam/'+currentExam._id);
  }

  isExamFinish(): Boolean {
    this.tempExamDate = this.examDetails.examDate + 'T' + this.examDetails.startTime + ":00";
    this.tempRemainingTime = new Date(this.tempExamDate).getTime() - new Date().getTime();
    return this.tempRemainingTime + this.examDetails.duration*60*1000 <= 0;
  }
}
