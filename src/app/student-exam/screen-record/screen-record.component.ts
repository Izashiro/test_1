import { CommaExpr } from '@angular/compiler';
import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from 'src/app/shared/exam.service';
import { MyNotification } from 'src/app/shared/notification.model';
import { StudentExamService } from 'src/app/shared/student-exam.service';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
import io from 'socket.io-client';

declare function screenWidthHeight():any;

const mediaDevices = navigator.mediaDevices as any;
let completeBlob: Blob;
const socket = io('http://localhost:3000');

declare var MediaRecorder: any;
@Component({
  selector: 'app-screen-record',
  templateUrl: './screen-record.component.html',
  styleUrls: ['./screen-record.component.css']
})
export class ScreenRecordComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService, private examService: ExamService, private studentService: StudentExamService) { }

  @HostListener('window:focus', ['$event'])
    onFocus(event:any) {
    this.msg = 'User is back on screen';
    this.url = '';
    this.sendNotification()
  }

  @HostListener('window:blur', ['$event'])
    onBlur(event:any) {
    this.msg = 'User has left the screen';
    this.url = '';
    this.sendNotification();
    this.playAudio('changeScreen.m4a');
  }

  playAudio(filename: string){
    let audio = new Audio();
    audio.src = "../../../assets/audio/" + filename;
    audio.load();
    audio.play();
  }

  scrHeight:any;
  scrWidth:any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event:any) {
      if(!screenWidthHeight()){
        this.msg = "Exam tab not full screened"
        this.url = '';
        //this.recordStop();
        this.sendNotification();
      }

  }

  id: string = '';
  userDetails = new User();
  hasVideo: boolean = false;
  isRecording: boolean = false;
  recorder: any;
  stream: any;
  url!: string;
  msg!: string;
  notification = new MyNotification();

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
   // console.log('id id: ',this.id);
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
       },
      (err:any) => {}
    );
    this.recordStart();
  }

  @ViewChild('recordVideo')
  recordVideo!: ElementRef;

  async startRecording() {
    await mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    }).then((strm:any)=>{
      this.stream = strm;
      this.recorder = new MediaRecorder(strm);
      let displaySurface = strm.getVideoTracks()[0].getSettings().displaySurface;
      if (displaySurface !== 'monitor') {
        console.log('Selection of entire screen mandatory!');
      }
      const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) =>{   chunks.push(e.data) }
    this.recorder.onstop = (e: any) => {
      completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.sendScreenBlob();
      console.log(completeBlob.size);
      try{
        this.recordVideo.nativeElement.src = URL.createObjectURL(completeBlob)
      }catch(e){
        //to do
        console.log(e);
      }
    };

    this.recorder.start();
    }).catch( (err:any) => {
      //to dos
      console.log(err)
    });





  }



  recordStart() {
    console.log('started')
    this.hasVideo = false;
    this.isRecording = true;
    this.startRecording();
  }

  sendScreenBlob(){
    console.log('called')
    //this.examService.setBlob(completeBlob);
    this.notification.cameraRecord = "";
    this.notification.screenRecord = this.url;
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = this.msg;
    console.log(this.notification);
    this.studentService.notify(this.notification, this.id, new Blob()).subscribe(
      res => {
        socket.emit('notification', this.notification);
        //this.startRecording()
      },
      err => {}
    );
  }

  recordStop() {
    console.log('stopped')
    this.hasVideo = true;
    this.isRecording = false;
    this.recorder.stop();
    this.stream.getVideoTracks()[0].stop();

    //console.log(this.stream);
  }

  sendBlob(){
    console.log('called')
    this.examService.setBlob(completeBlob);
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "abcc";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User tried to change or resize the tab";
    console.log(this.notification);
    this.studentService.notify(this.notification, this.id, completeBlob).subscribe(
      res => { console.log('done')},
      err => {}
    );

  }

  sendNotification(){
    console.log('called')
    this.examService.setBlob(completeBlob);
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = this.msg;
    console.log(this.notification);
    this.studentService.notify(this.notification, this.id, new Blob()).subscribe(
      res => { console.log('done')},
      err => {}
    );

  }

  downloadBlob(name = 'video.mp4'): any {
    if (
      window.navigator &&
      (window.navigator as any).msSaveOrOpenBlob
    ) return (window.navigator as any).msSaveOrOpenBlob(completeBlob);


    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(completeBlob);
    console.log(data)

    const link = document.createElement('a');
    link.href = data;
    link.download = name;


    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );


    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }


}
