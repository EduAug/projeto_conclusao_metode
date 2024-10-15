import { Component, ElementRef, ViewChild, AfterViewChecked, Input} from '@angular/core';
import { GeminiService } from '../gemini.service';

@Component({
  selector: 'app-code-window',
  templateUrl: './code-window.component.html',
  styleUrl: './code-window.component.css'
})
export class CodeWindowComponent {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @Input() answer: string= "";

  isExpanded: boolean= false;
  loading: boolean= false;


  ngAfterViewChecked(): void{
    this.scrollToBottom();
  }

  toggleExpand(): void{
    this.isExpanded= !this.isExpanded;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  private scrollToBottom(): void{
    if(this.chatMessagesContainer){
      try{
        this.chatMessagesContainer.nativeElement.scrollTop= this.chatMessagesContainer.nativeElement.scrollHeight;
      }catch (err){
        console.error('Chat fechado, ', err);
      }
    }
  }
}
