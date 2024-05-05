import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Exam } from './exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  selectedExam : Exam = new Exam();
  exams : Exam[] = [];
  blob = new Blob();
  tempLink : string = "";
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}

  postExam(exam: Exam, examQuestion: File){
    var formData: any = new FormData();
    formData.append('examName', exam.examName);
    formData.append('startTime', exam.startTime);
    formData.append('examDate', exam.examDate);
    formData.append('duration', exam.duration);
    formData.append('teacherID', exam.teacherID);
    formData.append('outSightTime', exam.outSightTime);
    formData.append('teacherName', exam.teacherName);
    formData.append('question', examQuestion);
    return this.http.post( environment.apiBaseUrl+'/createExam', formData );
  }

  setBlob(blob: Blob){
    this.blob = blob;
  }

  getExamList(userID: string){
    this.tempLink = environment.apiBaseUrl+'/exams/' + userID;
    return this.http.get( this.tempLink );
  }

  getSingleExamDetails(examID: string){
    return this.http.get(environment.apiBaseUrl + '/exam/' + examID);
  }

  getNotifications(examID: string){
    return this.http.get(environment.apiBaseUrl+ '/exam/notifications/' + examID)
  }

  update(exam: Exam, examQuestion: File){
    var formData: any = new FormData();
    formData.append('examName', exam.examName);
    formData.append('startTime', exam.startTime);
    formData.append('examDate', exam.examDate);
    formData.append('duration', exam.duration);
    formData.append('teacherID', exam.teacherID);
    formData.append('outSightTime', exam.outSightTime);
    formData.append('teacherName', exam.teacherName);
    formData.append('question', examQuestion);
    return this.http.put(environment.apiBaseUrl + '/exam' + `/${exam._id}`, formData);
  }

  deleteExam(exam:Exam){
    return this.http.delete(environment.apiBaseUrl+ '/exams'+ `/${exam._id}`);
  }

  invite(inviteCredentials:any){
    return this.http.post(environment.apiBaseUrl + '/invite', inviteCredentials);
  }

  getParticipant(participantID: string){
    return this.http.get(environment.apiBaseUrl + '/participantinfo/' + participantID);
  }

  kickFromExam(leaveCredential: any, examCode: string){
    return this.http.put(environment.apiBaseUrl + '/student/exams/' + examCode, leaveCredential);
  }
}
