import { Component } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrl: './manage-page.component.css'
})
export class ManagePageComponent {
  displayName: string= '';
  savedCodes: any[]= [];
  hover: boolean= false;

  constructor(public route: Router, private apiService: GeminiService){}

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

  logout(){
    sessionStorage.removeItem('token');
    this.route.navigate(['/landing']);
  }

  updateInfo(){
    console.log("todo");
  }

  deleteAccount(){
    console.log("todo");
  }
}
