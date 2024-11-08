import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GeminiService } from '../gemini.service';
import { Router } from '@angular/router';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

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
  loading: boolean= false;
  isPasswordVisible: boolean= false;

  @ViewChild(NotificationPopupComponent) notif!: NotificationPopupComponent;

  constructor(
    public route: Router,
    public dialogRef: MatDialogRef<SignupPopupComponent>,
    private apiService: GeminiService
  ){}

  onClose(): void{
    this.dialogRef.close();
  }

  onSubmit(): void{
    this.loading= true;
    this.apiService.signup(this.signupData).subscribe({
      next: ()=> {
        let dataSignin= {email: this.signupData.email, pwd: this.signupData.pwd}
        this.apiService.login(dataSignin).subscribe({
          next: (rspns)=> {
            sessionStorage.setItem('token', rspns.token);
            this.loading= false;
            this.route.navigate(['/manage']);
            this.dialogRef.close();
          },
          error: ()=> {
            this.loading= false;
            console.error("Failed login part of signup");
          }
        });
      },
      error: ()=> {
        this.loading= false;
        console.error("Failed signup");
        this.notif.showMessage("Erro ao cadastrar. Esse email já está em uso.", "error");
      }
    });
  }

  isNameValid(name: string): boolean{
    return !/\s/g.test(name);
  }
  
  isValid(password: string): boolean{
    const minLength= password.length >= 6;
    const hasUpper= /[A-Z]/.test(password);
    const hasLower= /[a-z]/.test(password)
    const hasNumber= /\d/.test(password);
    const hasSpecial= /[!@#$%¨&*]/.test(password);
    const hasNoWhitespace= !/\s/.test(password);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial && hasNoWhitespace;
  }
}
