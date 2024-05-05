import { Component, OnInit } from '@angular/core';


declare function startFaceRecognition(): any;

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.css']
})
export class FaceRecognitionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("sad");
    startFaceRecognition()
  }

}
