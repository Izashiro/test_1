import { Injectable } from '@angular/core';
import { Exam } from './exam.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MyNotification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class StudentExamService {
  exams: Exam[] = [];
  selectedExam: Exam = new Exam();

  constructor(private http: HttpClient) {}

  joinExam(joinCredential: any, examCode: string) {
    return this.http.put(
      environment.apiBaseUrl + '/joinExam/' + examCode,
      joinCredential
    );
  }

  retrieveExam(studentID: string) {
    return this.http.get(
      environment.apiBaseUrl + '/student/exams/' + studentID
    );
  }

  leaveExam(leaveCredential: any, examCode: string) {
    return this.http.put(
      environment.apiBaseUrl + '/student/exams/' + examCode,
      leaveCredential
    );
  }

  notify(notification: MyNotification, examCode: string, blob: Blob) {
    var formData: any = new FormData();
    formData.append('batch', notification.batch);
    formData.append('cameraRecord', notification.cameraRecord);
    formData.append('email', notification.email);
    formData.append('fullName', notification.fullName);
    formData.append('institute', notification.institute);
    formData.append('message', notification.message);
    formData.append('phone_number', notification.phone_number);
    formData.append('screenRecord', notification.screenRecord);
    var file = new File([blob], Date.now() + '.mp4');
    formData.append('record', file);
    return this.http.put(
      environment.apiBaseUrl + '/addEvidence/' + examCode,
      formData
    );
  }

  getSingleExamDetails(examID: string) {
    return this.http.get(environment.apiBaseUrl + '/exam/' + examID);
  }

  putVideoChunk(blob: Blob, examCode: string) {
    fetch('http://localhost:3000/chunk', {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
      },
      body: new Blob([blob], { type: 'video/mp4' }),
    });
  }

  putVideoChunkTEST(blob: Blob, examCode: string) {
    fetch('http://localhost:4000/chunk', {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
      },
      body: new Blob([blob], { type: 'video/mp4' }),
    });
  }
}
