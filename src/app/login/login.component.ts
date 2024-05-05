import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private toastr: ToastrService, private router: Router, private userServce: UserService, private http: HttpClient) { }

  model ={
    email: '',
    password: ''

  }
  serverErrorMessages: string = '';
  loginStatus: boolean = false;
  ngOnInit(): void {
    this.loginStatus = localStorage.getItem('loginStatus') == 'true';
    if(this.loginStatus){
      this.router.navigateByUrl('dashboard');
    }
  }

  noAccount(){
    this.router.navigate(['signup']);
  }

  showSuccessToast() {
    this.toastr.success(this.serverErrorMessages);
  }

  showFailToast() {
    this.toastr.error(this.serverErrorMessages);
  }

  signIn(){
    this.userServce.login(this.model).subscribe(
      (res:any) => {
        if(res['token']){
          localStorage.setItem('token', res['token']);
          this.userServce.changeStatus();
          this.router.navigateByUrl('dashboard');
        }
        this.serverErrorMessages = "Login Successful";
        this.showSuccessToast();
      },
      err => {
        this.serverErrorMessages = err.error.message;
        this.showFailToast();
      }
    );
  }
}
