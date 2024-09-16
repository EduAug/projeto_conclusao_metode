import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-list-operation',
  templateUrl: './add-list-operation.component.html',
  styleUrl: './add-list-operation.component.css'
})
export class AddListOperationComponent {
  targetVar: string = '';
  operation: string = '';
  userVars: string[] = [];
  availableVars: string[] = [];
  matchingVars: string[] = [];
  customVal: string = '';
  selectedVar: string = '';
  internalType: string = '';
  loops: number= 0;

  allowedTypesForOperation: { [key: string]: string[] } = {
    'FOREACH': ['string', 'integer', 'boolean', 'float'],
    'LOOP': ['string', 'integer', 'boolean', 'float'],
    'ADD': ['string', 'integer', 'boolean', 'float'],
    'REMOVE': ['string', 'integer', 'boolean', 'float'],
  };
  constructor(
    public dialogRef: MatDialogRef<AddListOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.operation= data.operation;
    this.userVars= data.userVars;

    const allowedTypes= this.allowedTypesForOperation[this.operation] || [];
    this.availableVars= this.filterVarsByType(allowedTypes);
  }

  filterVarsByType(allowed: string[]): string[]{
    return this.userVars.filter(e=> {
      const type= this.extractType(e);
      return type.endsWith('[]') && allowed.includes(type.slice(0, -2));
    })
  }

  extractType(str: string): string{
    const parts= str.split(':');
    if(parts.length=== 2){
      return parts[1].trim().replace('}', '');
    }
    return '';
  }

  onTargetVarChange(): void{
    const listType= this.extractType(this.targetVar);
    if (listType.endsWith('[]')){
      this.internalType= listType.slice(0, -2);
      this.matchingVars= this.getMatchingVars(this.internalType);
    }
    console.log(listType);
    console.log(this.matchingVars);
  }

  getMatchingVars(internal: string): string[]{
    return this.userVars.filter(e=> {
      const type= this.extractType(e);
      return type=== internal;
    })
  }

  isInputValid(): boolean{
    if(this.operation=== "FOREACH"){
      return !!this.targetVar
    }else if(this.operation=== "LOOP"){
      return !!(this.loops > 0);
    }else{
      return !!(this.customVal || this.selectedVar) && !!this.targetVar;
    }
  }

  addOperation(): void{
    let opera;
    if (this.operation=== 'FOREACH'){
      opera= `PARA CADA {item} EM ${this.targetVar}`;
    }else if(this.operation=== 'LOOP'){
      opera= `REPITA ${this.loops} VEZES`;
    }else if(this.selectedVar){
      (this.operation === "ADD") ? this.operation= "ADICIONAR" : this.operation= "REMOVER";
      opera= `${this.operation} ${this.selectedVar} EM ${this.targetVar}`;
    }else if(this.customVal && Number(this.customVal)){
      (this.operation === "ADD") ? this.operation= "ADICIONAR" : this.operation= "REMOVER";
      opera= `${this.operation} ${this.customVal} EM ${this.targetVar}`;
    }else{
      (this.operation === "ADD") ? this.operation= "ADICIONAR" : this.operation= "REMOVER";
      opera= `${this.operation} "${this.customVal}" EM ${this.targetVar}`;
    }
    this.dialogRef.close(opera);
  }

  closeDialog(): void{
    this.dialogRef.close();
  }
}
