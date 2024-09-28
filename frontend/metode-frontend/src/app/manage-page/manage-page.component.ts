import { Component, ViewChild } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { UpdatePopupComponent } from '../update-popup/update-popup.component';

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrl: './manage-page.component.css'
})
export class ManagePageComponent{
  displayName: string= '';
  savedCodes: any[]= [];
  loading: boolean= false;
  hover: boolean= false;

  @ViewChild(NotificationPopupComponent) notif!: NotificationPopupComponent;

  constructor(
    public route: Router, 
    public dialog: MatDialog,
    private apiService: GeminiService,
  ){}

  ngOnInit(){
    this.fetchUserDetails();
    this.fetchSavedCodes();
  }

  fetchUserDetails(){
    this.apiService.getDName().subscribe(
      (rspns)=> this.displayName= rspns.nome,
      (err)=> console.error("Erro ao obter nome de usuario", err)
    );
  }

  fetchSavedCodes(){
    this.apiService.getCodes().subscribe(
      (rspns)=> this.savedCodes= rspns,
      (err)=> console.error("Erro ao obter codigos do usuario", err)
    )
  }

  editCode(codeId: number, titulo: string){
    //console.log(id);
    this.route.navigate(['/lab'], { queryParams: { id: codeId, titulo: titulo } });
  }

  deleteCode(codeId: number){
    this.apiService.deleteCode(codeId).subscribe(
      (rspns)=>{
        //Passa um filtro na lista, removendo aquele("S"?) cuja id
        //sejam a mesma do deletado
        this.savedCodes= this.savedCodes.filter(cd=> cd.id !== codeId);
        this.notif.showMessage("Código deletado!", "success");
      },
      (error)=> {
        console.error("Erro ao deletar código:",error);
        this.notif.showMessage("Erro ao deletar código. Tente novamente.", "error");
      }
    )
  }

  logout(){
    sessionStorage.removeItem('token');
    this.route.navigate(['/landing']);
  }

  updateInfo(){
    this.loading= true;
    this.apiService.getUserData().subscribe(
      (data)=> {
        const dialogRef= this.dialog.open(UpdatePopupComponent, {
          data: {email: data.email, dname: data.dname},
        });
        this.loading= false;
        dialogRef.afterClosed().subscribe(
          (res)=>{
            if(res){
              sessionStorage.removeItem('token');
              this.route.navigate(['/landing']);
            }
          }
        );
      },
      (error)=> {
        console.error("Erro ao captar dados do usuário",error);
      }
    );
  }

  deleteAccount(){
    const dialogRef= this.dialog.open(LoginPopupComponent, {
      data: { isDeletion: true }
    });

    dialogRef.afterClosed().subscribe(
      (res)=>{
        if (res && res.success){
          this.apiService.deleteAccount().subscribe(
            (rspns)=>{
              this.notif.showMessage("Conta deletada com sucesso", "success");
              setTimeout(() => {
                this.logout();
              }, 700);
            },
            (error)=>{
              this.notif.showMessage("Erro ao deletar conta", "error");
            }
          );
        }
    });
  }
}
