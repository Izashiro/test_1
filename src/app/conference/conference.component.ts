import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import Utils from '../utils/utils';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
})
export class ConferenceComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  public createRoom(): void {
    const roomId = this.activatedRoute.snapshot.paramMap.get('id');
    this.router.navigateByUrl(`/call/${roomId}`);
  }
}
