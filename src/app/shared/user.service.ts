import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  response = {
    userId: '',
    email: '',
  };
  examNum = '';
  selectedUser: User = new User();
  loginStatus: boolean = false;
  constructor(private http: HttpClient) {}
  name = '';
  type = '';
  email = '';
  examId = '';
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };
  arr = new Array();
  serviceWork(a: any, b: any) {
    this.arr = a;
    this.name = b;
  }
  getArr() {
    return this.arr;
  }
  setResponse(userId: string, email: string) {
    this.response.userId = userId;
    this.response.email = email;
  }

  getResponseUserID(): string {
    return this.response.userId;
  }

  getResponseEmail(): string {
    return this.response.email;
  }

  changeStatus() {
    localStorage.setItem('loginStatus', 'true');
  }
  postUser(user: User, file: File) {
    var formData: any = new FormData();
    formData.append('fullName', user.fullName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('institute', user.institute);
    formData.append('phone_number', user.phone_number);
    formData.append('designation', user.designation);
    formData.append('bactch', user.batch || 0);
    formData.append('roll', user.roll || 0);
    formData.append('isTeacher', user.isTeacher);
    formData.append('image', file);
    console.log(user);
    return this.http.post(
      environment.apiBaseUrl + '/register',
      formData,
      this.noAuthHeader
    );
  }

  register(data: any) {
    return this.http.post(environment.apiHelperUrl, data);
  }

  login(authCredentials: any) {
    return this.http.post(
      environment.apiBaseUrl + '/authenticate',
      authCredentials,
      this.noAuthHeader
    );
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  //helper methods
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else return null;
  }

  /*getUserDetails(userID: string){
    //todo
    return this.http.get(environment.apiBaseUrl + '/exam/' + userID);
  }*/

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else return false;
  }

  verifyOTP(response: any) {
    return this.http.post(environment.apiBaseUrl + '/verifyOTP', response);
  }
  resendOTP(response: any) {
    return this.http.post(environment.apiBaseUrl + '/resendOTP', response);
  }
  sendSnapShot(req: any) {
    return this.http.post('http://localhost:8000/recognize/', req);
  }
}
