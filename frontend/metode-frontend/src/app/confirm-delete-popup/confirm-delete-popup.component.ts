import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-popup',
  templateUrl: './confirm-delete-popup.component.html',
  styleUrl: './confirm-delete-popup.component.css'
})
export class ConfirmDeletePopupComponent {
  
  constructor(public dialogRef: MatDialogRef<ConfirmDeletePopupComponent>){}

  onSubmit(): void{
    this.dialogRef.close(true);
  }

  onCancel(): void{
    this.dialogRef.close(false);
  }
}
