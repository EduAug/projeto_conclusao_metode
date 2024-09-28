import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GeminiService } from '../gemini.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
  @Input() isDeletion: boolean= false;

  loginData= {
    email:'',
    pwd:''
  };
  loading: boolean= false;
  loginFailed: boolean= false;

  constructor(
    public dialogRef: MatDialogRef<LoginPopupComponent>,
    public render: Renderer2,
    public router: Router,
    private apiService: GeminiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    if(data) this.isDeletion= data.isDeletion;
  }

  onClose(): void{
    this.dialogRef.close();
  }

  onSubmit(): void{
    this.loading= true;
    this.apiService.login(this.loginData).subscribe(
      (rspns)=> {
        sessionStorage.setItem('token', rspns.token);

        if(this.isDeletion){
          this.dialogRef.close({ success: true });
        }else{
          this.dialogRef.close();
          this.router.navigate(['/manage']);
        }
      },
      (error)=> {
        this.loading= false;
        this.loginFailed= true;
        let emailField= document.querySelector('.email-field');
        let pwdField= document.querySelector('.password-field');

        this.render.addClass(emailField, 'mat-form-field-error');
        this.render.addClass(pwdField, 'mat-form-field-error');
        setTimeout(()=>{
          this.render.removeClass(emailField, 'mat-form-field-error');
          this.render.removeClass(pwdField, 'mat-form-field-error');
          this.loginFailed= false;
        }, 5000);
      }
    )
  }
}
