import { Component, ViewChild } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddPopupComponent } from '../add-popup/add-popup.component';
import { AddTextPopupComponent } from '../add-text-popup/add-text-popup.component';
import { AddMathOperationComponent } from '../add-math-operation/add-math-operation.component';
import { AddListOperationComponent } from '../add-list-operation/add-list-operation.component';
import { ActivatedRoute } from '@angular/router';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';


@Component({
  selector: 'app-lab-page',
  templateUrl: './lab-page.component.html',
  styleUrl: './lab-page.component.css'
})
export class LabPageComponent {
  langs: string[] = ["C#","Java","Ruby","Dart","C++","JavaScript","Python","Golang", "Rust"];
  operations: string[] = [
    "DECLARE", "MOSTRE", 
    "ALTERAR {variavel}","ADICIONAR {valor/variavel} A {variavel}", "SUBTRAIR {valor/variavel} DE {variavel}", "MULTIPLICAR {variavel} POR {valor/variavel}", "DIVIDIR {variavel} POR {valor/variavel}", 
    "{variavel} IGUAL A {valor/variavel}", "{variavel} DIFERENTE DE {valor/variavel}", 
    "{variavel} MAIOR QUE {valor/variavel}", "{variavel} MAIOR OU IGUAL A {valor/variavel}", "{variavel} MENOR QUE {valor/variavel}", "{variavel} MENOR OU IGUAL A {valor/variavel}",
    "SE", "SE / SENÃO", "SE / SENÃO CASO / SENÃO", 
    "REPITA {valor} VEZES", "REPITA ENQUANTO",
    "PARA CADA {item} EM {lista}", "ADICIONAR A {lista}", "REMOVER DE {lista}"
  ];
  items: string[] = []; // "Código" do usuário
  vars: string[]= []; // Variáveis do usuário
  codeId: number= -1;
  codeDetails= {};
  codeTitulo: string= "";

  isLogged: boolean= false;
  firstSave: boolean= true;
  loading: boolean= false;

  selectedLang: string= "";
  question: string= "";
  answer: string= "";

  @ViewChild(NotificationPopupComponent) notif!: NotificationPopupComponent;

  canEnterCodeList= (drag: CdkDrag, drop: CdkDropList): boolean =>{
    //Permite que apenas os itens de Variáveis e Items ("Drag") sejam largados no código do usuário (Drop)
    return drop.id === 'userCode' && (drag.dropContainer.id !== 'userCode');
  }

  canEnterVariableOperationList= (drag: CdkDrag, drop: CdkDropList): boolean =>{
    //Faz com que os itens do código (Drag) não possa ser largado nas outras listas
    return drag.dropContainer.id !== 'userCode';
  }

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private gptService: GeminiService
  ){}
  
  ngOnInit(){
    this.route.queryParams.subscribe(params=>{

      this.codeId= params['id'];
      this.firstSave= !this.codeId;
      this.codeTitulo= params['titulo'] || '';
      this.isLogged= !!sessionStorage.getItem('token');

      if(this.codeId){
        this.loadCode(this.codeId);
      }
    });
  }

  //Libera o botão para perguntar apenas com conteúdo
  isFormValid(): boolean { 
    return this.items.length > 1 && this.selectedLang !== '';
  }

  //Evento de drop, biblioteca do Angular
  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }else{
      if (event.container.id === "userCode"){
        event.container.data.splice(event.currentIndex, 0, event.previousContainer.data[event.previousIndex]);
      }else{
        transferArrayItem(
          event.previousContainer.data,event.container.data,
          event.previousIndex, event.currentIndex
        );
      }
    }
    this.question="";
    this.items.forEach(e => {
      this.question+= `${e} `;
    });
  }

  //Ao clicar no item da primeira lista, remove dela
  removeItem(index: number): void{
    const itemToRemove= this.items[index];
    switch (itemToRemove) {
      case "SE":
        let i1= this.items.indexOf("SE");
        this.items.splice(i1, 1);

        let i2= this.items.indexOf("ENTÃO");
        this.items.splice(i2, 1);

        let i3= this.items.indexOf("SENÃO CASO");
        this.items.splice(i3, 1);

        let i4= this.items.indexOf("ENTÃO");
        this.items.splice(i4, 1);

        let i5= this.items.indexOf("SENÃO");
        this.items.splice(i5, 1);

        let i6= this.items.indexOf("FIM-SE");
        this.items.splice(i6, 1);
        
        break;
      default:
        break;
    }
    this.items.splice(index, 1);

  }

  //Ao clicar duas vezes na variável, remove ela
  removeVar(vari: string): void{
   this.vars= this.vars.filter(v=> v !== vari);
   this.items= this.items.filter(i=> !i.includes(vari));
  }

  //Adiciona uma das funções/operações padrão na primeira lista ao clicar
  addFunctionToCode(funct: string): void{
    switch (funct) {
      case "DECLARE":
        this.items.push("DECLARE");
        this.question+= `${funct} `;
        break;
        
      case "MOSTRE":
        this.items.push("MOSTRE");
        this.question+= `${funct} `;
        break;

      case "ALTERAR {variavel}":
        this.openAddMathDialog("=");
        break;

      //MATHEMATICAL

      case "ADICIONAR {valor/variavel} A {variavel}":
        this.openAddMathDialog("+");
        break;

      case "SUBTRAIR {valor/variavel} DE {variavel}":
        this.openAddMathDialog("-");
        break;
        
      case "MULTIPLICAR {variavel} POR {valor/variavel}":
        this.openAddMathDialog("*");
        break;
        
      case "DIVIDIR {variavel} POR {valor/variavel}":
        this.openAddMathDialog("/");
        break;

      //COMPARISON

      case "{variavel} IGUAL A {valor/variavel}":
        this.openAddMathDialog("==");
        break;

      case "{variavel} DIFERENTE DE {valor/variavel}":
        this.openAddMathDialog("!=");
        break;

      case "{variavel} MAIOR QUE {valor/variavel}":
        this.openAddMathDialog(">");
        break;

      case "{variavel} MAIOR OU IGUAL A {valor/variavel}":
        this.openAddMathDialog(">=");
        break;

      case "{variavel} MENOR QUE {valor/variavel}":
        this.openAddMathDialog("<");
        break;

      case "{variavel} MENOR OU IGUAL A {valor/variavel}":
        this.openAddMathDialog("<=");
        break;

      //IF

      case "SE":
        this.items.push("SE", "ENTÃO", "FIM-SE");
        break;
    
      case "SE / SENÃO":
        this.items.push("SE", "ENTÃO", "SENÃO", "FIM-SE");
        break;

      case "SE / SENÃO CASO / SENÃO":
        this.items.push("SE", "ENTÃO", "SENÃO CASO", "ENTÃO", "SENÃO", "FIM-SE");
        break;

      //LOOP / LISTA

      case "REPITA ENQUANTO":
        this.items.push("REPITA", "ENQUANTO");
        break;

      case "REPITA {valor} VEZES":
        this.openAddListDialog("LOOP");
        break;

      case "PARA CADA {item} EM {lista}":
        this.openAddListDialog("FOREACH");
        this.vars.push("{item}");
        break;

      case "ADICIONAR A {lista}":
        this.openAddListDialog("ADD");
        break;

      case "REMOVER DE {lista}":
        this.openAddListDialog("REMOVE");
        break;
      
      default:
        console.log("Que loucura padrinho");
        break;
    }
  }

  //Abre o dialog para criação de variável
  openAddDialog(): void{ 
    const dialogRef= this.dialog.open(AddPopupComponent);

    dialogRef.afterClosed().subscribe(result=>{
      if (result) this.vars.push(result);
    });
  }

  //Abre o dialog para criação de textos livres
  openAddTextDialog(): void{ 
    const dialogRef= this.dialog.open(AddTextPopupComponent);

    dialogRef.afterClosed().subscribe(result=>{
      if (result) this.items.push(`'${result}'`);
      this.question+= result;
    });
  }

  //Abre o dialog para operações matemáticas
  openAddMathDialog(opera: string): void{
    const dialogRef= this.dialog.open(AddMathOperationComponent, {
      data: {
        operation: opera,
        userVars: this.vars
      }
    });

    dialogRef.afterClosed().subscribe(result=>{
      if (result) this.items.push(result);
    });
  }

  //Abre o dialog para alteração em listas
  openAddListDialog(opera: string): void{
    const dialogRef= this.dialog.open(AddListOperationComponent, {
      data: {
        operation: opera,
        userVars: this.vars
      }
    });

    dialogRef.afterClosed().subscribe(result=>{
      if (result) this.items.push(result);
    })
  }

  //Post para enviar solicitação ao endpoint
  askGemini() {
    this.question="";
    this.items.forEach(e => {
      this.question+= `${e} `;
    });
    this.gptService.askDQuestion(`Retorne o seguinte em ${ this.selectedLang }, preste atenção nas variáveis, encontram-se entre chaves({}) constando seu nome e tipo portanto retire as chaves quando for instanciar variáveis, e os "arrays" devem ser considerados como listas. "DECLARE" representa um input do usuário. ${ this.question }.`)
      .subscribe(rspns=> {
        let rawresponse = rspns.response;
        if(rawresponse.startsWith('```') && rawresponse.endsWith('```')){
          this.answer= rawresponse.replace(/(^```[\w]*\n|\n```$)/g,'');
        }else{
          this.answer= rawresponse;
        }
      });
  }

  //Procura pelo código caso já exista, e carrega os dados salvos nos devidos locais
  loadCode(id: number){
    this.gptService.getCodeDetails(id).subscribe(
      (rspns)=>{
        this.codeDetails= rspns;
        this.loadData(this.codeDetails);
      }
    )
  }//Carrega os detalhes nas respectivas listas
  loadData(details: any){
    this.items= details.code;
    this.vars= details.variaveis;
  }

  saveCode(){
    this.loading= true;
    const payload= {
      title: this.codeTitulo,
      varis: this.vars,
      code: this.items,
    };

    if(this.firstSave){
      this.gptService.saveCode(payload).subscribe(
        (rspns)=> {
          this.loading= false;
          this.firstSave= false;
          this.codeId= rspns.id;
          this.notif.showMessage("Código salvo com sucesso", "success");
        },
        (error)=> {
          this.loading= false;
          this.notif.showMessage("Erro ao salvar código", "error");
        }
      );
    }else {
      if(this.codeId){
        this.gptService.updateCode(this.codeId, payload).subscribe(
          (rspns)=> {
            this.loading= false;
            this.notif.showMessage("Código atualizado com sucesso", "success");
          },
          (error)=> {
            this.loading= false;
            this.notif.showMessage("Erro ao atualizar código", "error");
          }
        )
      }
    }
  }
}
