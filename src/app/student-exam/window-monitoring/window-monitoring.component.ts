import { HostListener, Component, OnInit } from '@angular/core';
import { MyNotification } from 'src/app/shared/notification.model';
import { StudentExamService } from 'src/app/shared/student-exam.service';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
import io from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';

const socket = io('http://localhost:3000');
declare function isScreenWidthHeightOK():any;
@Component({
  selector: 'app-window-monitoring',
  templateUrl: './window-monitoring.component.html',
  styleUrls: ['./window-monitoring.component.css']
})
export class WindowMonitoringComponent implements OnInit {

  notification= new MyNotification();
  userDetails = new User();
  id: string = '';
  constructor(private userService: UserService, private examService: StudentExamService, private route: ActivatedRoute) { }

  @HostListener('window:focus', ['$event'])
    onFocus(event:any) {
  }

  @HostListener('window:blur', ['$event'])
    onBlur(event:any) {
    this.playAudio('changeScreen.m4a');
  }

  scrHeight:any;
  scrWidth:any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event:any) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
  }
  playAudio(filename: string){
    let audio = new Audio();
    audio.src = "../../../assets/audio/" + filename;
    audio.load();
    audio.play();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    isScreenWidthHeightOK();
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
       },
      (err:any) => {}
    );
  }

  notify(){
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User tried to change or resize the tab";
    this.examService.notify(this.notification, this.id, new Blob()).subscribe(
      res =>{
        socket.emit('notification', this.notification);
      },
      err => {
        console.log('erroor');
      }
    )
  }

}
