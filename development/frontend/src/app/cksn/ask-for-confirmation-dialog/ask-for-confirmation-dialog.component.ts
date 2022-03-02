import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ConfirmationAction {
  title: String = "Save"
  message: String = "Are you sure to save this change?"
}


@Component({
  selector: 'app-ask-for-confirmation-dialog',
  templateUrl: './ask-for-confirmation-dialog.component.html',
  styleUrls: ['./ask-for-confirmation-dialog.component.css']
})
export class AskForConfirmationDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<AskForConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationAction) { }


  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(0);
  }

  onYesClick(): void {
    this.dialogRef.close(1)
  }


}
