import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}
  id = '';
  arr = new Array();
  name = '';
  listArr = new Array();

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    const marshall = JSON.stringify({
      id: this.id,
      email: this.userService.email,
      type: this.userService.type,
    });
    fetch(environment.apiBaseUrl + '/viewData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: marshall,
    })
      .then((res) =>
        res.json().then((res: any) => {
          console.log('RESPONSE', res);

          for (let i in res) {
            let dt = new Date(res[i].time);
            console.log(dt);
            let tm = dt;
            this.listArr.push({
              message: res[i].message,
              time: tm,
            });
          }
        })
      )
      .catch((err) => {
        console.log('ERROR');
      });

    // (res: any) => {
    //   console.log(res);
    //   for (let i in res) {
    //     let dt = new Date(res[i].time);
    //     console.log(dt);
    //     let tm = dt;
    //     this.listArr.push({
    //       message: res[i].message,
    //       time: tm,
    //     });
    //   }
    // },
    //
    // (err) => {}
    this.arr = this.userService.getArr();
    this.name = this.userService.name;
    console.log(this.arr);
    console.log(this.name);
  }
  goback() {
    this.router.navigateByUrl('table');
  }
}
