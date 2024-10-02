import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GeminiService } from '../gemini.service';
import { Router } from '@angular/router';

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
      }
    });
  }

  isNameValid(name: string): boolean{
    //console.log(/\s/g.test(name));
    return !/\s/g.test(name);
  }
  
  isValid(password: string): boolean{
    //console.log("Origin: ",password);
    const minLength= password.length >= 6;
    //console.log("Minimo 6?",minLength);
    const hasUpper= /[A-Z]/.test(password);
    //console.log("Tem maiuscula?",hasUpper);
    const hasLower= /[a-z]/.test(password)
    //console.log("Tem minuscula?",hasLower);
    const hasNumber= /\d/.test(password);
    //console.log("Tem numero?",hasNumber);
    const hasSpecial= /[!@#$%¨&*]/.test(password);
    //console.log("Tem especial?",hasSpecial);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  }
}
