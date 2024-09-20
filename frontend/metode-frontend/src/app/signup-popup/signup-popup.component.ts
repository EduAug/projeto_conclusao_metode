import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signup-popup',
  templateUrl: './signup-popup.component.html',
  styleUrl: './signup-popup.component.css'
})
export class SignupPopupComponent {
  signupData= {
    email:'',
    dname:'',
    pwd:''
  };

  constructor(public dialogRef: MatDialogRef<SignupPopupComponent>){}

  onClose(): void{
    this.dialogRef.close();
  }

  onSubmit(): void{
    console.log(this.signupData);
    this.dialogRef.close(this.signupData);
  }
}
