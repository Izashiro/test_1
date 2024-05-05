import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { MyNotification } from '../shared/notification.model';
import { User } from '../shared/user.model';

import io from 'socket.io-client';
import { BehaviorSubject, observable, Observable, tap, timer } from 'rxjs';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';

const socket = io('http://localhost:3000');

@Component({
  selector: 'app-details-teacher-exam-card',
  templateUrl: './details-teacher-exam-card.component.html',
  styleUrls: ['./details-teacher-exam-card.component.css'],
})
export class DetailsTeacherExamCardComponent implements OnInit {
  month: string = '';
  selectedExam = new Exam();
  recipientEmail: string = '';
  kickParticipant = new User();
  file!: File;
  userName = '';
  msgDummy = {
    msg: '',
  };
  messageList: { message: string; userName: string; mine: boolean }[] = [];
  userList: string[] = [];
  months = new Map([
    [1, 'JAN'],
    [2, 'FEB'],
    [3, 'MAR'],
    [4, 'APR'],
    [5, 'MAY'],
    [6, 'JUN'],
    [7, 'JUL'],
    [8, 'AUG'],
    [9, 'SEP'],
    [10, 'OCT'],
    [11, 'NOV'],
    [12, 'DEC'],
  ]);

  model = {
    examCode: this.selectedExam._id,
    recipiennt: '',
  };

  kickModel = {
    examCode: '',
    userID: '',
    examName: '',
  };

  examDetails = new Exam();
  userDetails = new User();
  participants: User[] = [];
  tempUser!: User;
  dummyData!: any;
  notifications: MyNotification[] = [];
  copyNotifications: MyNotification[] = [];
  tempNotification = new MyNotification();
  participantSet = new Set<string>();
  observer: any;
  index: number = 0;
  id: string = '';
  notificationList = new BehaviorSubject<MyNotification[]>([]);
  tempExamDate: string = '';
  tempRemainingTime: number = 0;

  remDay: any;
  remHour: any;
  remMinute: any;
  remSecond: any;
  hide: Boolean = false;

  constructor(
    private toastr: ToastrService,
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    timer(0, 1000)
      .pipe(tap(() => this.loadNotification()))
      .subscribe();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.userService.getUserProfile().subscribe((res: any) => {
      this.userDetails = res['user'] as User;
      this.userNameUpdate(this.userDetails.fullName);
      socket.emit('newUser', this.userDetails.fullName);
      if (!this.userDetails.isTeacher) {
        this.router.navigateByUrl('dashboard');
      }
      setInterval(() => {
        const date = new Date();
        this.clockDown(date);
      }, 500);
    });

    this.examService.getSingleExamDetails(this.id).subscribe(
      (res: any) => {
        this.examDetails = res as Exam;
        this.refreshParticipantList();
        console.log(this.examDetails.question);
      },
      (err) => console.log(err)
    );
  }
  goTable(a: any) {
    this.userService.examNum = a;
    console.log('herer' + this.userService.examNum);
    this.router.navigateByUrl(`table/${this.id}`);
  }
  userNameUpdate(name: string): void {
    //this.socket = io.io(`https://chat-competent-programming.herokuapp.com/?userName=${name}`);
    this.userName = name;

    socket.emit('set-user-name', name);

    socket.on('user-list', (userList: string[]) => {
      this.userList = userList;
    });

    socket.on(
      'message-broadcast',
      (data: { message: string; userName: string }) => {
        if (data) {
          console.log(data);
          this.messageList.push({
            message: data.message,
            userName: data.userName,
            mine: false,
          });
        }
      }
    );
  }

  sendMessage(): void {
    if (this.msgDummy.msg != '') {
      socket.emit('message', this.msgDummy.msg);
      this.messageList.push({
        message: this.msgDummy.msg,
        userName: this.userName,
        mine: true,
      });
      this.msgDummy.msg = '';
    }
  }

  loadNotification() {
    this.examService.getNotifications(this.id).subscribe(
      (res: any) => {
        this.notificationList.next(res);
      },
      (err) => {}
    );
  }

  ngOnChanges(changes: SimpleChanges) {}

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  getExamDate(input: string): string {
    return input.substring(8, 10);
  }

  getExamMonth(input: string): any {
    this.month = input.substring(5, 7);
    return this.months.get(parseInt(this.month));
  }

  getPartipantList(exam: Exam) {}

  refreshNotifications(data: any) {
    return [...this.notifications, data];
  }

  refreshParticipantList() {
    this.participantSet = new Set<string>();
    this.participants = [];

    this.examService.getSingleExamDetails(this.id).subscribe((res: any) => {
      this.examDetails = res as Exam;
      this.examDetails.participants.forEach((participantID) => {
        this.participantSet.add(participantID);
      });
      this.participantSet.forEach((participantID) => {
        this.examService.getParticipant(participantID).subscribe(
          (res: any) => {
            this.tempUser = res as User;
            if (this.tempUser != null) {
              this.participants.push(JSON.parse(JSON.stringify(this.tempUser)));
            }
          },
          (err: any) => {}
        );
      });
    });
  }

  onClick(exam: Exam) {
    this.selectedExam = JSON.parse(JSON.stringify(exam));
  }

  update() {
    this.examService.update(this.selectedExam, this.file).subscribe(
      (res: any) => {
        this.reloadComponent();
        this.toastr.success('Exam is updated');
      },
      (err) => {
        console.log(
          'Error in updating exam: ' + JSON.stringify(err, undefined, 2)
        );
      }
    );
  }

  studentDetails(student_id: any) {
    var url = '/teacher/examdetails/' + this.examDetails._id + '/' + student_id;
    console.log(student_id);
    this.router.navigateByUrl(url);
  }

  delete() {
    this.examService.deleteExam(this.selectedExam).subscribe(
      (res: any) => {
        this.toastr.success('Exam is deleted');
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        console.log('error in deleting: ' + JSON.stringify(err, undefined, 2));
      }
    );
  }

  resetForm() {
    this.selectedExam.duration = 0;
    this.selectedExam.examName = '';
    this.selectedExam.examDate = '';
    this.selectedExam.startTime = '';
  }

  invite() {
    this.model.examCode = this.selectedExam._id;
    this.model.recipiennt = this.recipientEmail;
    console.log(this.model.recipiennt);
    this.examService.invite(this.model).subscribe(
      (res: any) => {
        this.model.recipiennt = '';
        this.toastr.success('Invitation sent');
      },
      (err) => {
        this.toastr.error('error in inviting: ' + err);
      }
    );
  }

  onKick(participant: User) {
    this.kickParticipant = participant;
  }

  kick() {
    console.log(this.examDetails, this.kickParticipant);
    this.kickModel.examCode = this.examDetails._id;
    this.kickModel.userID = this.kickParticipant._id;
    this.examService
      .kickFromExam(this.kickModel, this.kickModel.examCode)
      .subscribe(
        (res: any) => {
          this.toastr.success('Successfully kicked');
          this.examService.getSingleExamDetails(this.id).subscribe(
            (response: any) => {
              this.examDetails = response as Exam;
              console.log('exam: ', this.examDetails);
              this.refreshParticipantList();
            },
            (err) => {}
          );
        },
        (err: any) => {
          console.log(
            'Error in updating exam: ' + JSON.stringify(err, undefined, 2)
          );
        }
      );
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  clockDown(date: Date) {
    this.tempExamDate =
      this.examDetails.examDate + 'T' + this.examDetails.startTime + ':00';
    this.tempRemainingTime =
      new Date(this.tempExamDate).getTime() - new Date().getTime();

    if (this.tempRemainingTime < 5 * 60 * 1000 && this.tempRemainingTime >= 0) {
      this.hide = !this.hide;
    }

    if (this.tempRemainingTime < 0) {
      this.hide = false;
      this.remDay = '00';
      this.remHour = '00';
      this.remMinute = '00';
      this.remSecond = '00';
    } else {
      this.remSecond = Math.floor(this.tempRemainingTime / 1000);
      this.remMinute = Math.floor(this.remSecond / 60);
      this.remHour = Math.floor(this.remMinute / 60);

      this.remMinute %= 60;
      this.remSecond %= 60;
      this.remHour = this.remHour < 10 ? '0' + this.remHour : this.remHour;
      this.remMinute =
        this.remMinute < 10 ? '0' + this.remMinute : this.remMinute;
      this.remSecond =
        this.remSecond < 10 ? '0' + this.remSecond : this.remSecond;
    }
  }
}
