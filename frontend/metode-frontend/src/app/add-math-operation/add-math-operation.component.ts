import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-math-operation',
  templateUrl: './add-math-operation.component.html',
  styleUrl: './add-math-operation.component.css'
})
export class AddMathOperationComponent {
  customVal: string= "";
  selectedVar: string= "";
  targetVar: string= "";
  booleanVal: boolean= false;
  operation: string;
  availableVars: string[]= [];

  userVars: string[];

  allowedTypesForOperation: {[key: string]: string[]}= {
    //Math
    ADD: ['integer', 'float', 'string'],
    SUBTRACT: ['integer', 'float', 'string'],
    MULTIPLY: ['integer', 'float'],
    DIVIDE: ['integer', 'float'],
    ASSIGN: ['integer', 'float', 'string', 'boolean'],
    //Comparison
    EQUALS: ['integer', 'float', 'string', 'boolean'],
    DIFFERS: ['integer', 'float', 'string', 'boolean'],
    GREATER: ['integer', 'float'],
    GREATEREQUALS: ['integer', 'float'],
    LESSER: ['integer', 'float'],
    LESSEREQUALS: ['integer', 'float']
  };

  constructor(
    public dialogRef: MatDialogRef<AddMathOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.operation= data.operation;
    this.userVars= data.userVars;
    let tempOperation;

    switch (this.operation) {
      case "=":
        tempOperation= "ASSIGN";
        break;
        
      case "+":
        tempOperation= "ADD";
        break;

      case "-":
        tempOperation= "SUBTRACT";
        break;

      case "/":
        tempOperation= "MULTIPLY";
        break;

      case "*":
        tempOperation= "DIVIDE";
        break;
        
      case "==":
        tempOperation= "EQUALS";
        break;

      case "!=":
        tempOperation= "DIFFERS";
        break;

      case ">":
        tempOperation= "GREATER";
        break;

      case ">=":
        tempOperation= "GREATEREQUALS";
        break;

      case "<":
        tempOperation= "LESSER";
        break;

      case "<=":
        tempOperation= "LESSEREQUALS";
        break;

      default:
        tempOperation= '';
        break;
    }
    const allowedTypes= this.allowedTypesForOperation[tempOperation] || [];
    console.log(allowedTypes);
    this.availableVars= this.filterVarsByType(allowedTypes);
    console.log(this.availableVars);
  }

  isInputValid(): boolean {
    if ((this.customVal || this.selectedVar) && this.targetVar){
      return true;
    }else if(this.booleanVal && this.targetVar){
      return true;
    };
    return false;
  }

  isTargetVarBool(): boolean {
    const targetType= this.extractType(this.targetVar);
    return targetType === 'boolean';
  }

  isMathOp(): boolean{
    return this.operation=== "="
        || this.operation=== "+" 
        || this.operation=== "-" 
        || this.operation=== "*"
        || this.operation=== "/";
  }

  addOperation(){
    let opera;
    const targetType= this.extractType(this.targetVar);
    if(targetType === 'boolean'){
      opera= `${this.targetVar} ${this.operation} ${this.booleanVal}`;
    }else{
      if (this.customVal){
        opera= `${this.targetVar} ${this.operation} ${this.customVal}`;
      }else {
        opera= `${this.targetVar} ${this.operation} ${this.selectedVar}`;
      }
    }
    
    this.dialogRef.close(opera);
  }

  closeDialog(){
    this.dialogRef.close();
  }

  filterVarsByType(allowed: string[]): string[]{
    return this.userVars.filter(varStr=> {
      const type= this.extractType(varStr);
      return allowed.includes(type);
    })
  }

  extractType(varStr: string): string{
    const parts= varStr.split(':');
    if(parts.length === 2){
      return parts[1].trim().replace(/}$/, '');
    }
    return '';
  }
}
