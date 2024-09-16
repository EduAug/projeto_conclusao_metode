import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-text-popup',
  templateUrl: './add-text-popup.component.html',
  styleUrl: './add-text-popup.component.css'
})
export class AddTextPopupComponent {
  newItem: string= "";

  constructor(public dialogRef: MatDialogRef<AddTextPopupComponent>){}

  addItem(){
    this.dialogRef.close(this.newItem);
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
