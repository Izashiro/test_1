import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { reduce } from 'rxjs';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  userDetails = new User();
  userid: string = "";
  isCollapsed: boolean = true;

  constructor(private userService: UserService, private router: Router) { }

  status: boolean = false;

  ngOnInit(): void {
  }

  getStatus():boolean{
    return localStorage.getItem('loginStatus') == 'true';
  }

  getProfile(){
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        this.userid = res._id;
      },
      (err:any) => {}
    );
  }

  onLogout() {
    this.userService.deleteToken();
    this.userService.loginStatus = false;
    localStorage.setItem('loginStatus', 'false');
    this.router.navigateByUrl('/login');
  }

}
