import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowMonitoringComponent } from './window-monitoring.component';

describe('WindowMonitoringComponent', () => {
  let component: WindowMonitoringComponent;
  let fixture: ComponentFixture<WindowMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
