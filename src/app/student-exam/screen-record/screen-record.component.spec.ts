import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenRecordComponent } from './screen-record.component';

describe('ScreenRecordComponent', () => {
  let component: ScreenRecordComponent;
  let fixture: ComponentFixture<ScreenRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
