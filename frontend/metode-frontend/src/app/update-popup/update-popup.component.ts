import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeminiService } from '../gemini.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrl: './update-popup.component.css'
})
export class UpdatePopupComponent {
  userData={
    dname: "",
    email: "",
    pwd: ""
  };
  loading: boolean= false;

  constructor(
    public dialogRef: MatDialogRef<UpdatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: GeminiService,
    private route: Router
  ) {
    this.userData.dname= data.dname;
    this.userData.email= data.email;
  }

  isNameValid(name: string): boolean{
    //console.log(/\s/g.test(name));
    return !/\s/g.test(name);
  }

  isValid(password: string): boolean{
    const minLength= password.length >= 6;
    const hasUpper= /[A-Z]/.test(password);
    const hasLower= /[a-z]/.test(password);
    const hasNumber= /\d/.test(password);
    const hasSpecial= /[!@#$%¨&*]/.test(password);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  }

  onClose(){
    this.dialogRef.close();
  }

  onUpdate(){
    this.loading= true;
    this.apiService.updateAccount(this.userData).subscribe(
      (rspns)=> {
        this.loading= false;
        this.dialogRef.close(true);
      },
      (error)=> {
        this.loading= false;
        console.error("Erro ao atualizar dados");
      }
    )
  }
}
