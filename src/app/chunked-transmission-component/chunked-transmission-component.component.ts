import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentExamService } from '../shared/student-exam.service';
import { UserService } from '../shared/user.service';
import { MyNotification } from '../shared/notification.model';
import { Throttler } from '../utils/utils';

@Component({
  selector: 'app-chunked-transmission-component',
  templateUrl: './chunked-transmission-component.component.html',
  styleUrls: ['./chunked-transmission-component.component.css'],
})
export class ChunkedTransmissionComponent implements OnInit {
  private readonly DELTATIME = 500;

  private isStreaming = false;
  private displayMediaStream: MediaStream = null!;
  private userMediaStream: MediaStream = null!;
  private displayMediaThrottler = new Throttler();
  private userMediaThrottler = new Throttler();
  private killStream = false;

  constructor(
    private examService: StudentExamService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private studentService: StudentExamService
  ) {}

  async ngOnInit(): Promise<void> {
    this.displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    });
    this.userMediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    });
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any) {
    // this.studentService.notify()
    // TODO Send a plain notification
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any) {
    console.log('BLUE');
    this.triggerStream();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event: any) {
    // this.triggerStream();
  }

  triggerStream() {
    if (this.isStreaming) {
      return;
    }

    console.log('TRIGGER');

    // get media recorders
    const displayMediaRecorder = new MediaRecorder(this.displayMediaStream);
    const userMediaRecorder = new MediaRecorder(this.userMediaStream);

    // these callbacks decide what to do with chunk streas
    displayMediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (this.killStream) {
        this.isStreaming = false;
      } else {
        this.isStreaming = true;
        this.killStream = false;
      }
      // if (this.displayMediaThrottler.applyThrottle()) {
      //   console.log('Throttle OK');
      // } else {
      //   console.log('Throttle BLOCKED');
      // }
      this.studentService.putVideoChunkTEST(e.data, '');
    };

    userMediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (this.userMediaThrottler.applyThrottle()) {
        // this.studentService.putVdeoChunk(e.data, '');
      }
    };

    displayMediaRecorder.start(this.DELTATIME);
    userMediaRecorder.start(this.DELTATIME);

    const terminate = () => {
      displayMediaRecorder.stop();
      userMediaRecorder.stop();

      //@ts-ignore
      this.isStreaming = false;
      this.killStream = true;
      console.log('EVENT DIE');
    };

    setTimeout(terminate.bind(this), 3000);
  }
}
