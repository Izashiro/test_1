import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { User } from './shared/user.model';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-snapshot',
  template: `
    <webcam
      [height]="0"
      [width]="0"
      [trigger]="triggerObservable"
      (imageCapture)="handleImage($event)"
      [imageQuality]="1"
      (initError)="handleInitError($event)"
    ></webcam>
  `,
  styles: [],
})
export class SnapshotComponent implements OnInit {
  // toggle webcam on/off
  public showWebcam = false;
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage | null = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  user: User = new User();

  constructor(private userService: UserService) {}
  public ngOnInit(): void {
    setInterval(() => this.triggerSnapshot.apply(this), 5000);
    this.userService.getUserProfile().subscribe((res: any) => {
      //console.log(res)
      this.user = res['user'];
      //console.log(this.user)
    });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  // public toggleWebcam(): void {
  //   this.showWebcam = !this.showWebcam;
  // }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    const formData = new FormData();

    //const url = 'http://localhost:8000/recognize/' + this.user.faceId + '/recognize/';

    this.webcamImage = webcamImage;
    var data = {
      img: webcamImage.imageAsBase64,
      faceId: this.user.faceId,
    };

    this.userService.sendSnapShot(data).subscribe((res: any) => {
      console.log(res);
    });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
