import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/services/chat.service';
import { debounce } from 'src/app/services/debounce';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{
  userMessage:string=""
  messages:any[]=[]
  userId: string = 'user1'; 
  selectedFile: File | null = null;

  constructor(
    private chatService:ChatService, 
    private cdr: ChangeDetectorRef,
    private toastr:ToastrService){
      this.sendMessage = debounce(this.sendMessage.bind(this), 1000);
    }

  ngOnInit() {
    this.chatService.startListening();
    this.chatService.messages.subscribe(chat => {
      console.log(chat);
      this.messages.push(chat);
      this.cdr.detectChanges();
    });

    console.log(this.messages);
  }

  sendMessage() {
    if (this.userMessage.trim() || this.selectedFile) {
      const message = { userId:'user123',message: this.userMessage, response: '', };
      console.log(this.messages)
     
      this.chatService.sendMessage('user123', this.userMessage, this.selectedFile).then(response => {
        console.log("response", response)

        console.log(response.reply)
        
          this.messages.push({
            userId:'user123',
            message:this.userMessage,
            response:response.reply || response.error
          })
          this.userMessage = '';   

        console.log(this.messages)
        this.selectedFile = null;
      })
 
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
    this.toastr.success("File attached successfully")
  }

  clear() {
    this.chatService.clearChatHistory().subscribe(response => {
      console.log(response.message);
      this.messages = []; 
    }, error => {
      console.error('Error clearing chat history:', error);
    });
  }
}
