import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  id: string = '63d3c99796ffaca8c95042d5';
  data = {};
  headers: any = [];
  cols: any = [];
  mod = false;
  listArr = new Array();
  name: string = 'dummy';
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.func();
    // this.id = this.userService.examNum;
  }

  func() {
    this.http
      .post(environment.apiBaseUrl + '/report', { id: this.id })
      .subscribe(
        (res: any) => {
          let d = res;
          let c = 0;

          for (let i in d) {
            if (c == 0) this.headers = Object.keys(d[i]);
            c++;
            this.cols.push(Object.values(d[i]));
          }
          console.log(this.cols);
          console.log(this.headers);
          console.log(this.headers.length);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  view = (a: any, b: any, c: any, d: string) => {
    this.name = d;
    this.mod = true;
    console.log(d);
    console.log(a);
    console.log(b);
    console.log(c);
    this.userService.name = d;
    this.userService.type = c;
    this.userService.email = b;
    this.userService.examNum = a;

    console.log('VIEW', a);

    this.router.navigateByUrl(`list/${this.id}`);
  };
  evaluate = (a: any): boolean => {
    return a > 1;
  };
}
