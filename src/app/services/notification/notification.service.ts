import { Injectable } from '@angular/core';
import { Client, Message} from '@stomp/stompjs';
import { Subject } from 'rxjs';
import SockJS from 'sockjs-client';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // private client: Client;
  private notificationSubject = new Subject<string>();
  public notification$ = this.notificationSubject.asObservable();
  constructor() {
    // this.client = new Client({
    //   webSocketFactory: () => new SockJS('http://localhost:8080/ws-rappel'),
    //   reconnectDelay: 5000,
    // });

    // this.client.onConnect = () => {
    //   this.client.subscribe('/topic/rappels', (message:Message) => {
    //     const body = JSON.parse(message.body);
    //     this.notificationSubject.next(body.message);
    //   });
    // };

    // this.client.activate();
  }
}
