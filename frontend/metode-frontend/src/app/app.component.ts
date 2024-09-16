import { Component } from '@angular/core';
import { GeminiService } from './gemini.service';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddPopupComponent } from './add-popup/add-popup.component';
import { AddTextPopupComponent } from './add-text-popup/add-text-popup.component';
import { AddMathOperationComponent } from './add-math-operation/add-math-operation.component';
import { AddListOperationComponent } from './add-list-operation/add-list-operation.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
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

  selectedLang: string= "";
  question: string= "";
  answer: string= "";

  canEnterCodeList= (drag: CdkDrag, drop: CdkDropList): boolean =>{
    //Permite que apenas os itens de Variáveis e Items ("Drag") sejam largados no código do usuário (Drop)
    return drop.id === 'userCode' && (drag.dropContainer.id !== 'userCode');
  }

  canEnterVariableOperationList= (drag: CdkDrag, drop: CdkDropList): boolean =>{
    //Faz com que os itens do código (Drag) não possa ser largado nas outras listas
    return drag.dropContainer.id !== 'userCode';
  }

  constructor(private geminiService: GeminiService, public dialog: MatDialog){}
  
  //Libera o botão para perguntar apenas com conteúdo
  isFormValid(): boolean { 
    return this.question.length > 0 && this.selectedLang !== '';
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
        let i2= this.items.indexOf("ENTÃO");
        let i3= this.items.indexOf("SENÃO");
        let i4= this.items.indexOf("SENÃO CASO");
        let i5= this.items.indexOf("FIM-SE");
        this.items.splice(i1, 1);
        this.items.splice(i2, 1);
        this.items.splice(i3, 1);
        this.items.splice(i4, 1);
        this.items.splice(i5, 1);
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
    this.geminiService.askDQuestion(`Por favor, retorne o seguinte pseudocódigo em ${ this.selectedLang }, mencionando using/import/etc, SEM comentários explicativos, preste atenção nas variáveis, encontram-se entre chaves({}) constando seu nome e tipo portanto retire as chaves quando for instanciar variáveis. Não crie strings adicionais quando necessário.\n${ this.question }.`)
      .subscribe(rspns=> {
        let rawresponse = rspns.response;
        if(rawresponse.startsWith('```') && rawresponse.endsWith('```')){
          this.answer= rawresponse.replace(/(^```[\w]*\n|\n```$)/g,'');
        }else{
          this.answer= rawresponse;
        }
      });
  }
}
