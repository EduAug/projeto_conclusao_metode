import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-popup',
  templateUrl: './add-popup.component.html',
  styleUrl: './add-popup.component.css'
})
export class AddPopupComponent {
  newItemName: string= "";
  newItemType: string= "";
  listItemType: string= "";
  isAList: boolean= false;

  variableTypes: string[]= ["Texto", "Numeral", "Decimal", "Booleano", "Lista"];
  listVariableTypes: string[]= this.variableTypes.filter(t=>t!=="Lista");
  //Cópia da variableTypes, porém filtrando para remover "Lista", a fim de evitar "Listas de listas"

  typeMapping: {[key:string]: string}= {
    Texto: "string",
    Numeral: "integer",
    Decimal: "float",
    Booleano: "boolean",
    Lista: "list"
  };
  //"Enum" para passar do tipo que o usuário escolhe para um "tipo real"

  constructor(public dialogRef: MatDialogRef<AddPopupComponent>){}

  onTypeChange(){ //Avalia se foi trocado de outro tipo para Lista
    this.isAList = this.newItemType === "Lista";
  }

  isValid(): boolean{ //Libera a criação apenas se todos os campos forem preenchidos
    if(!this.newItemName || !this.newItemType){
      return false;
    }
    if(this.isAList && !this.listItemType){
      return false;
    }
    return true;
  }

  addItem(){
    let newItem; //Inicia a variável
    const realType= this.typeMapping[this.newItemType]; //Passa o tipo escolhido para um real
    if (this.isAList){ //Se for uma lista, passa para tiporeal[]
      newItem= `{${this.newItemName} : ${this.typeMapping[this.listItemType]}[]}`
    }else{              //Se não for uma lista, cria semelhante a um json
      newItem= `{${this.newItemName} : ${realType}}`;
    } //Fecha o dialog retornando a variável criada
    this.dialogRef.close(newItem);
  }
      //Fecha o dialog retornando nada
  closeDialog(){
    this.dialogRef.close();
  }
}
