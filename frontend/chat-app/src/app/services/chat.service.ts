import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/chat/send';
  private eventSource: EventSource | null = null;
  public messages: Subject<any> = new Subject();

  constructor(private http:HttpClient) {}

  startListening() {
    this.eventSource = new EventSource('http://localhost:3000/chat/events');

    this.eventSource.onmessage = (event:any) => {
      const message = JSON.parse(event.data);
      this.messages.next(message);
    };

    this.eventSource.onerror = (error:any) => {
      console.error('EventSource failed:', error);
      this.eventSource?.close();
    };
  }

  sendMessage(userId: string, message: string, file: File | null) {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('message', message);

    if (file) {
      formData.append('file', file, file.name);
    }

    return fetch(this.apiUrl, {
      method: 'POST',
      body: formData,
    }).then(response => response.json());
  }

  clearChatHistory(): Observable<any> {
    return this.http.delete('http://localhost:3000/chat/clear');
  }
}