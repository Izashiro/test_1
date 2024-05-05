import { Injectable } from '@angular/core';
import { chartData } from './chart-data.model';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  data: chartData[] = [
    {name: "Out", count: 0},
    {name: "In", count: 0},
    {name: "Cheat", count: 0}
  ]

  constructor() { }

  setData(a:any, b:any, c:any) {
    this.data[0].count = a;
    this.data[1].count = b;
    this.data[2].count = c;
  }

  getData() {
    return this.data;
  }
}
