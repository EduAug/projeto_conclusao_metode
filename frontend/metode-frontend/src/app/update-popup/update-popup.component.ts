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
