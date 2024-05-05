import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunkedTransmissionComponent } from './chunked-transmission-component.component';

describe('ChunkedTransmissionComponentComponent', () => {
  let component: ChunkedTransmissionComponent;
  let fixture: ComponentFixture<ChunkedTransmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChunkedTransmissionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChunkedTransmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
