import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeminiService } from '../gemini.service';
import { Router } from '@angular/router';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrl: './update-popup.component.css'
})
export class UpdatePopupComponent {
  userData={
    email: "",
    dname: "",
    pwd: ""
  };
  loading: boolean= false;

  @ViewChild(NotificationPopupComponent) notif!: NotificationPopupComponent;

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
        this.notif.showMessage("Erro ao cadastrar. Email já está em uso.", "error");
      }
    )
  }
}
