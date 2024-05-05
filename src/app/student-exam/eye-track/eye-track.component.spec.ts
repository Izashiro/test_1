import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeTrackComponent } from './eye-track.component';

describe('EyeTrackComponent', () => {
  let component: EyeTrackComponent;
  let fixture: ComponentFixture<EyeTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
