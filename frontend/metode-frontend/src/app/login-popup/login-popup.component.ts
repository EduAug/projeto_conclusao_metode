import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
  loginData= {
    email:'',
    pwd:''
  };

  constructor(public dialogRef: MatDialogRef<LoginPopupComponent>){}

  onClose(): void{
    this.dialogRef.close();
  }

  onSubmit(): void{
    console.log(this.loginData);
    this.dialogRef.close(this.loginData);
  }
}
