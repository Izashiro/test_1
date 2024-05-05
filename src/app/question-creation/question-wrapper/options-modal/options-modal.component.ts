import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-options-modal',
  templateUrl: './options-modal.component.html',
  styleUrls: ['./options-modal.component.css']
})
export class OptionsModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OptionsModalComponent>) { }

  ngOnInit(): void {
  }

  selectOption(option: string) {
    this.dialogRef.close(option);
  }

}
