import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.css'
})
export class NotificationPopupComponent {
  @Input() message: string= '';
  @Input() type: string= 'success';

  visible: boolean= false;

  showMessage(msg: string, type: 'success' | 'error'){
    this.message= msg;
    this.type= type;
    this.show();
  }

  show(){
    this.visible= true;
    setTimeout(()=> {
      this.visible= false;
    }, 3000);
  }
}
