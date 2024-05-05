import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }
  model = {
    userId : '',
    email : '',
    otp : ''
  }

  ngOnInit(): void {
    this.model.userId = this.userService.getResponseUserID();
    this.model.email = this.userService.getResponseEmail();
  }

  verify(){
    this.userService.verifyOTP(this.model).subscribe(
      (res:any)=>{
        if(res.status == 'VERIFIED') {
          this.toastr.success("Succesfully verified email")
          this.router.navigateByUrl('dashboard')
        }
      },
      err => console.log(err)
    )
  }

  resend(){
    this.userService.resendOTP(this.model).subscribe(
      (res:any) => {

      },
      err=> {
        console.log(err)
      }
    )
  }
}
