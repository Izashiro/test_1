import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Exam } from '../shared/exam.model';
import { ExamService } from '../shared/exam.service';
import { MyNotification } from '../shared/notification.model';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import io from 'socket.io-client';
import { BehaviorSubject, observable, Observable, tap, timer } from 'rxjs';
import jsPDF from 'jspdf';
import { chartData } from '../shared/chart-data.model';
import { ChartDataService } from '../shared/chart-data.service';
import { GanttChartDataService } from '../shared/gantt-chart-data.service';
import { ganttChart } from '../shared/gantt-chart-data.model';


declare var google: any;

@Component({
  selector: 'app-student-under-exam',
  templateUrl: './student-under-exam.component.html',
  styleUrls: ['./student-under-exam.component.css']
})
export class StudentUnderExamComponent implements OnInit {

  constructor(private gdata:GanttChartDataService, private cdata: ChartDataService, private examService: ExamService, private route: ActivatedRoute, private router: Router, private userService: UserService, private toastr: ToastrService ) {
    timer(0,1000).pipe(tap(()=> this.loadNotification())).subscribe();
  }

  examID: string = '';
  studentID: string = '';
  examDetails = new Exam();
  teacherDetails = new User();
  studentDetails = new User();
  tempNotification = new MyNotification();
  //notifications: MyNotification[] = [];
  notificationList = new BehaviorSubject<MyNotification[]>([]);
  tempNotificationList = new BehaviorSubject<MyNotification[]>([]);
  onlySuspected = false;

  //
  inTime = 0;
  outTime = 0;
  cheatTime = 0;

  months =  new Map([
    [1, "JAN"],
    [2, "FEB"],
    [3, "MAR"],
    [4, "APR"],
    [5, "MAY"],
    [6, "JUN"],
    [7, "JUL"],
    [8, "AUG"],
    [9, "SEP"],
    [10, "OCT"],
    [11, "NOV"],
    [12, "DEC"]
  ]);


  ngOnInit(): void {
    this.examID = this.route.snapshot.params['id1'];
    this.studentID = this.route.snapshot.params['id2'];

    this.examService.getSingleExamDetails(this.examID).subscribe(
      (res:any) =>{
        this.examDetails = res as Exam;
        if (res == null) {
          this.toastr.error("Exam don't exist!")
          this.router.navigateByUrl('dashboard')
        }
        else {
          this.userService.getUserProfile().subscribe(
          (res:any) =>{
            this.teacherDetails = res['user'];
          })
          this.examService.getParticipant(this.studentID).subscribe(
            (res:any) => {
              this.studentDetails = res as User;
              this.analysisNotification();
            },
            (err:any) => {}
          );
        }
      }
    );

    //this.
  }

  analysisNotification() {
    this.examService.getNotifications(this.examID).subscribe(
      (res:any) => {
        this.tempNotificationList.next(res);
        var left = null;
        var disconnected = null;
        var minimize = null;
        var idr = 0;
        var pleft = 0;
        var pmin = 0;
        var pdis = 0;
        var pout = 0;

        for (var notification of this.tempNotificationList.value) {
          //console.log(notification.email, this.studentDetails.email);
          if (notification.email == this.studentDetails.email) {
            //console.log(notification.message);
            if (notification.message == "User has left the screen") {
              left = notification.time;
              //console.log(left);
            }
            else if (left != null && (notification.message == "User is back on screen" || notification.message == "Got disconnected" )) {
              //this.cheatTime += (new Date(notification.time) - new Date(left))
              //console.log(left, notification.time);
              this.cheatTime += (new Date(notification.time).getTime() - new Date(left).getTime());
              idr++;
              this.gdata.addData(idr.toString(), 'Left the screen', 'left', new Date(left), new Date(notification.time), (new Date(notification.time).getTime() - new Date(left).getTime()), 100, ((pleft == 0) ? null : pleft.toString()));
              pleft = idr;
              left = null;
              //console.log(this.cheatTime);
            }

            if (notification.message == "Exam tab not full screened") {
              minimize = notification.time;
              //console.log(left);
            }
            else if (minimize != null && (notification.message == "Exam tab full screened" || notification.message == "Got disconnected" )) {
              //this.cheatTime += (new Date(notification.time) - new Date(left))
              //console.log(left, notification.time);
              this.cheatTime += (new Date(notification.time).getTime() - new Date(minimize).getTime());
              idr++;
              this.gdata.addData(idr.toString(), 'Minimize the screen', 'minimize', new Date(minimize), new Date(notification.time), (new Date(notification.time).getTime() - new Date(minimize).getTime()), 100, ((pmin == 0) ? null : pmin.toString()));
              pmin = idr;
              minimize = null;
              //console.log(this.cheatTime);
            }

            if (notification.message == "Started the exam") {
              disconnected = notification.time;
              //console.log(left);
            }
            else if (disconnected != null && notification.message == "Got disconnected") {
              //this.cheatTime += (new Date(notification.time) - new Date(left))
              //console.log(left, notification.time);
              this.inTime += (new Date(notification.time).getTime() - new Date(disconnected).getTime());
              idr++;
              this.gdata.addData(idr.toString(), 'In the exam', 'disconnected', new Date(disconnected), new Date(notification.time), (new Date(notification.time).getTime() - new Date(disconnected).getTime()), 100, ((pdis == 0) ? null : pdis.toString()));
              pdis = idr;
              disconnected = null;
              console.log(this.inTime);
            }

            if (notification.message == "User has outsighted the screen longer than the limit") {
              this.cheatTime += this.examDetails.outSightTime * 1000;
              idr++;
              var temp = new Date(new Date(notification.time).getTime() + (this.examDetails.outSightTime * 1000));
              console.log(temp, new Date(notification.time));
              this.gdata.addData(idr.toString(), 'Outsighted the screen', 'outsighted', temp, new Date(notification.time), this.examDetails.outSightTime * 1000, 100, ((pout == 0) ? null : pout.toString()));
              pout = idr;
            }
          }
        }

        this.outTime = this.examDetails.duration * 60 * 1000 - this.inTime;
        this.inTime -= this.cheatTime;

        this.cdata.setData(this.outTime, this.inTime, this.cheatTime);

        google.charts.load('current', {packages: ['corechart']});
        this.buildChart(this.cdata.getData());

        google.charts.load('current', {'packages':['gantt']});
        this.buildGanttChart(this.gdata.getData());

        console.log(this.gdata.getData());
        console.log(new Date(2015, 2, 31));
      },
      err => {}
    );
  }

  buildGanttChart(datas: ganttChart[]) {
    var funcg=(chart:any) => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');
      datas.forEach(item => {
        data.addRows([
          [item.id, item.name, item.type, item.start, item.end, item.duration, item.complete, item.dependency]
        ]);
      });

      /*data.addRows([
        ['2014Spring', 'Spring 2014', 'spring',
         new Date(2014, 2, 22), new Date(2014, 5, 20), null, 100, null],
        ['2014Summer', 'Summer 2014', 'summer',
         new Date(2014, 5, 21), new Date(2014, 8, 20), null, 100, null],
        ['2014Autumn', 'Autumn 2014', 'autumn',
         new Date(2014, 8, 21), new Date(2014, 11, 20), null, 100, null],
        ['2014Winter', 'Winter 2014', 'winter',
         new Date(2014, 11, 21), new Date(2015, 2, 21), null, 100, null],
        ['2015Spring', 'Spring 2015', 'spring',
         new Date(2015, 2, 22), new Date(2015, 5, 20), null, 50, null],
        ['2015Summer', 'Summer 2015', 'summer',
         new Date(2015, 5, 21), new Date(2015, 8, 20), null, 0, null],
        ['2015Autumn', 'Autumn 2015', 'autumn',
         new Date(2015, 8, 21), new Date(2015, 11, 20), null, 0, null],
        ['2015Winter', 'Winter 2015', 'winter',
         new Date(2015, 11, 21), new Date(2016, 2, 21), null, 0, null],
        ['Football', 'Football Season', 'sports',
         new Date(2014, 8, 4), new Date(2015, 1, 1), null, 100, null],
        ['Baseball', 'Baseball Season', 'sports',
         new Date(2015, 2, 31), new Date(2015, 9, 20), null, 14, null],
        ['Basketball', 'Basketball Season', 'sports',
         new Date(2014, 9, 28), new Date(2015, 5, 20), null, 86, null],
        ['Hockey', 'Hockey Season', 'sports',
         new Date(2014, 9, 8), new Date(2015, 5, 21), null, 89, null]
      ]);*/

      var options = {
        title: "Gantt chart",
        height: 400,
        gantt: {
          trackHeight: 30
        }
      }

      chart().draw(data, options);
    }

    var chart = () => new google.visualization.Gantt(document.getElementById('divGanttChart'));
    var callback = () => funcg(chart);
    google.charts.setOnLoadCallback(callback);
  }

  buildChart(datas: chartData[]) {
    var func=(chart:any) => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      datas.forEach(item => {
        data.addRows([
          [item.name, item.count]
        ]);
      });

      var options = {
        title: "Time Distribution",
        pieHole: 0.4
      }

      chart().draw(data, options);
    }

    var chart = () => new google.visualization.PieChart(document.getElementById('divPieChart'));
    var callback = () => func(chart);
    google.charts.setOnLoadCallback(callback);
  }

  /*drawChart() {
    // console.log(this.outTime);
    // console.log(this.inTime);
    // console.log(this.cheatTime);
    // console.log("aaaaa");
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Out from the exam', this.outTime],
      ['In Exam', this.inTime],
      ['Suspected', this.cheatTime]
    ]);

    var options = {
      title: "Time Distribution"
    }

    var chart = new google.visualization.PieChart(document.getElementById('divPieChart'));
    chart.draw(data, options);
  }*/

  notificationFilter() {
    this.onlySuspected = !this.onlySuspected;
  }

  loadNotification(){
    this.examService.getNotifications(this.examID).subscribe(
      (res:any) => {
        this.notificationList.next(res);
      },
      err => {}
    );
  }

  getExamDate(input: string): string{
    return input.substring(8,10);
  }

  getExamTime(input: string): string{
    return input.substring(11,19);
  }

  getExamMonth(input: string): any{
    var month = input.substring(5,7);
    return this.months.get(parseInt(month));
  }

  getNotificationType(message: string): string {
    if (message == 'Started the exam')
      return 'info';
    else if (message == 'Got disconnected')
      return 'warning';
    else if (message == 'User is back on screen')
      return 'success';
    else
      return 'danger';
  }


  /*
  @ViewChild('PDF', {static:false}) notificationElement!: ElementRef;

  generatePDF() {
    let pdf = new jsPDF();

    pdf.html(this.notificationElement.nativeElement, {
      callback: (pdf) => {
        pdf.save("notification");
      }
    })
  }
  */

}
