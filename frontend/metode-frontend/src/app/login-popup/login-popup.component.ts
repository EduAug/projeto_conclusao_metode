import { Component, Inject, Input, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GeminiService } from '../gemini.service';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

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

  @ViewChild(NotificationPopupComponent) notif!: NotificationPopupComponent;

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
        console.log(emailField);
        let pwdField= document.querySelector('.password-field');
        console.log(pwdField);
        
        const errorMessage= this.isDeletion 
          ? "Credenciais incorretas."
          : "Login Falhou. Confira seus dados (Letras maiúsculas inclusive)."
        
        this.notif.showMessage(errorMessage, "error");
        
        setTimeout(()=>{
          this.loginFailed= false;
        }, 3000);
      }
    )
  }
}
