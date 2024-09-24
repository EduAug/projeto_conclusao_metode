import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { GeminiService } from '../gemini.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  isExpanded: boolean= false;
  message: string= "";
  messages: string[]= [];
  userMessages: string[]= [];
  systemMessages: string[]= [];
  loading: boolean= false;

  constructor(private gptService: GeminiService){}

  ngAfterViewChecked(): void{
    this.scrollToBottom();
  }

  toggleExpand(): void{
    this.isExpanded= !this.isExpanded;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  sendMessage(): void{
    if(this.message.trim()){
      this.userMessages.push(this.message);
      this.messages.push(this.message);
      this.scrollToBottom();

      this.loading= true;

      this.gptService.chatMessage(this.userMessages.slice(-6), this.systemMessages.slice(-6), this.message)
        .subscribe({
          next: (rspns)=>{
            let responseMessage= rspns.response;
            this.systemMessages.push(responseMessage);
            this.messages.push(responseMessage);
            this.scrollToBottom();
          },
          error: (err)=>{
            console.error("Error communicating with chat service: ", err);
          },
          complete: ()=>{
            this.loading= false;
            this.message= "";
          }
        });
    }
  }

  isUserMessage(messg: string){
    return this.messages.indexOf(messg)%2 !== 0;
  }

  private scrollToBottom(): void{
    console.log("Starting scroll")
    if(this.chatMessagesContainer){
      console.log("found chatMessagesContainer");
      try{
        this.chatMessagesContainer.nativeElement.scrollTop= this.chatMessagesContainer.nativeElement.scrollHeight;
      }catch (err){
        console.log('Chat fechado, ', err);
      }
    }
  }
}
