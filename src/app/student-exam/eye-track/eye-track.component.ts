import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyNotification } from 'src/app/shared/notification.model';
import { StudentExamService } from 'src/app/shared/student-exam.service';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
import io from 'socket.io-client';
import { Exam } from 'src/app/shared/exam.model';
import { ToastrService } from 'ngx-toastr';

declare function startTrack(time_limit: number): any;
declare function suspectedStatus(): any;
declare function stopWebGazer(): any;
const socket = io('http://localhost:3000');

const mediaDevices = navigator.mediaDevices as any;
let completeBlob: Blob;

@Component({
  selector: 'app-eye-track',
  templateUrl: './eye-track.component.html',
  styleUrls: ['./eye-track.component.css']
})
export class EyeTrackComponent implements OnInit, OnDestroy {

  id: string = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private examService: StudentExamService, private toastr: ToastrService) { }
  notification= new MyNotification();
  userDetails = new User();
  exam = new Exam();
  hasVideo: boolean = false;
  isRecording: boolean = false;
  recorder: any;
  stream: any;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.examService.getSingleExamDetails(this.id).subscribe(
      (res: any) => {
        this.exam = res as Exam;
        socket.emit('examID', this.exam._id)
       startTrack(this.exam.outSightTime*1000);
       this.startRecording();
      },
      (err)=>{
        console.log(err);
      }
    )

    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        socket.emit('newUser', this.userDetails.fullName);
        socket.emit('newUserEmail', this.userDetails.email);
       },
      (err:any) => {}
    );
  }

  ngOnDestroy(){
    stopWebGazer();
  }

  intervalID: any = setInterval(() => {
    if (suspectedStatus() != 0) {
      this.playAudio('suspected.m4a');
      this.hasVideo = true;
      this.isRecording = false;
      if(this.recorder.state != 'inactive')
        this.recorder.stop();
      this.stream.getVideoTracks()[0].stop();
    }
  }, this.exam.outSightTime*1000);

  @ViewChild('recordVideo')
  recordVideo!: ElementRef;

  async startRecording() {
    await mediaDevices.getUserMedia({
      audio: true, video: true
    }).then((strm:any)=>{
      this.stream = strm;
      this.recorder = new MediaRecorder(strm);
      const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) =>{   chunks.push(e.data) }
    this.recorder.onstop = (e: any) => {
      completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.sendBlob();
      try{
        this.recordVideo.nativeElement.src = URL.createObjectURL(completeBlob)
      }catch(e){
        this.toastr.error('something went wrong');
        console.log(e);
      }
    };




    this.recorder.start();
    }).catch( (err:any) => {
      this.toastr.error('camera record error, please check your camera and try again')
      console.log(err)
    });





  }


  recordStart() {
    this.hasVideo = false;
    this.isRecording = true;
    this.startRecording();
  }


  recordStop() {
    //console.log('stopped')
    this.hasVideo = true;
    this.isRecording = false;
    if(this.recorder.state != 'inactive')
    this.recorder.stop();
    this.stream.getVideoTracks()[0].stop();
    //this.sendBlob();
    //console.log(this.stream);
  }


  notify(){
    //console.log("notifying");
    this.notification.cameraRecord = "";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User has outsighted the screen longer than the limit";
    this.examService.notify(this.notification, this.id, new Blob()).subscribe(
      res =>{
        socket.emit('notification', this.notification);
        //this.notifications.push(this.notification);
      },
      err => {
        console.log('erroor');
      }
    )
  }


  playAudio(filename: string){
    let audio = new Audio();
    audio.src = "../../../assets/audio/" + filename;
    audio.load();
    audio.play();
  }

  sendBlob(){
    //console.log('called')
    //this.examService.setBlob(completeBlob);
    this.notification.cameraRecord = "abcc";
    this.notification.screenRecord = "";
    this.notification.fullName = this.userDetails.fullName;
    this.notification.email = this.userDetails.email;
    this.notification.batch = this.userDetails.batch;
    this.notification.institute = this.userDetails.institute;
    this.notification.roll = this.userDetails.roll;
    this.notification.phone_number = this.userDetails.phone_number;
    this.notification.message = "User has outsighted the screen longer than the limit";
    //console.log(this.notification);
    this.examService.notify(this.notification, this.id, completeBlob).subscribe(
      res => {
        socket.emit('notification', this.notification);
        this.startRecording()},
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
    //console.log(data)

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




//https://bobbyhadz.com/blog/typescript-call-function-every-n-seconds#:~:text=Use%20the%20setInterval()%20method,is%20the%20delay%20in%20milliseconds.&text=Copied!
