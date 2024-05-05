import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionCreationService {


  deleteEventEmitter: EventEmitter<number> = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  addMCQQuestion(examID: string, payload: any) {
    return this.http.post(environment.apiBaseUrl+ `/exam/question/mcq/${examID}`,payload);
  }

  getMCQQuestion(examID: string) {
    return this.http.get(environment.apiBaseUrl+ `/exam/question/mcq/${examID}`);
  }

  addMCQAnswer(examID: string, payload: any) {
    return this.http.post(environment.apiBaseUrl + `/exam/answer/mcq/${examID}`, payload);
  }

  getMCQAnswer(examID: string) {
    return this.http.get(environment.apiBaseUrl + `/exam/answer/mcq/${examID}`);
  }
}
