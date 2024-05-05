import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }
  userDetails = new User();
  userid: string = "";
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        this.userid = res._id;
      },
      (err:any) => {}
    );
  }
}
