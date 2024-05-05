import { Injectable } from '@angular/core';
import { ganttChart } from './gantt-chart-data.model';

@Injectable({
  providedIn: 'root'
})
export class GanttChartDataService {
  data: ganttChart[] = [];

  constructor() { }

  addData(idr: string, namer: string, typer: string, startr: any, endr: Date, durationr: number, completer: number, dependencyr: any) {
    this.data.push({id: idr, name: namer, type: typer, start: startr, end: endr, duration: durationr, complete: completer, dependency: dependencyr});
  }

  getData() {
    return this.data;
  }
}
