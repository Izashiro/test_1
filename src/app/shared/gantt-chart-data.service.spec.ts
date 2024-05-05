import { TestBed } from '@angular/core/testing';

import { GanttChartDataService } from './gantt-chart-data.service';

describe('GanttChartDataService', () => {
  let service: GanttChartDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GanttChartDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
