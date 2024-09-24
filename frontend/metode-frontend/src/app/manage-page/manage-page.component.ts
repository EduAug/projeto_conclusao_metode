import { Component } from '@angular/core';
import { GeminiService } from '../gemini.service';

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrl: './manage-page.component.css'
})
export class ManagePageComponent {
  displayName: string | null= null;

  constructor(private apiService: GeminiService){}

  ngOnInit(){
    this.apiService.getDName().subscribe(
      (rspns)=> {
        this.displayName= rspns.nome;
      },
      error=> {
        console.error('Erro ao obter nome de usuario', error);
      }
    )
  }
}
