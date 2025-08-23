import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { MessageDTO } from '../interfaces/message.dto';
import { Message } from '../interfaces/message';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi-meet',
  imports: [
    SidebarComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './jitsi-meet.component.html',
  styleUrls: ['./jitsi-meet.component.css']
})
export class JitsiMeetComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() roomName!: string;
  @Input() userDisplayName!: string;
  @Input() userEmail?: string;
  @Input() userRole!: 'PATIENT' | 'PRO_SANTE';
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  nouveauMessage: string = '';
  messages: Message[] = [];
  private api?: any;

  selectedMedecin: any;
  patient: any;
  teleconsultation: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.initializeJitsi();
  }

  ngOnDestroy(): void {
    this.cleanupJitsi();
  }

  private initializeJitsi(): void {
  const domain = 'http://localhost:8000'; // <- ton serveur Jitsi auto-hébergé sur le port 62060
  const options = {
    roomName: this.roomName,
    width: '100%',
    height: '100%',
    parentNode: document.getElementById('jaas-container'),
    userInfo: {
      displayName: this.userDisplayName,
      email: this.userEmail
    },
    configOverwrite: {
      disableDeepLinking: true, // évite les problèmes de liens sur mobile
    },
    interfaceConfigOverwrite: {
      DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false
    }
  };

  try {
    this.api = new JitsiMeetExternalAPI(domain, options);

    // Enregistre les événements pour les participants et messages
    this.registerEventListeners();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Jitsi:', error);
  }
}


  private cleanupJitsi(): void {
    if (this.api) {
      this.api.dispose();
    }
  }

  private registerEventListeners(): void {
    if (!this.api) return;

    this.api.addListener('participantJoined', (participant: any) => {
      this.logEvent({
        roomId: this.roomName,
        event: 'participantJoined',
        user: participant.displayName || 'Unknown',
        timestamp: new Date().toISOString(),
        role: this.userRole
      });
    });

    this.api.addListener('incomingMessage', (event: any) => {
      this.handleIncomingMessage(event);
    });

    this.api.addListener('videoConferenceLeft', () => {
      this.logEvent({
        roomId: this.roomName,
        event: 'conferenceEnded',
        user: this.userDisplayName,
        timestamp: new Date().toISOString(),
        role: this.userRole
      });
    });
  }

  private handleIncomingMessage(event: any): void {
    if (!event.message) return;

    const payload: Message = {
      teleconsultationId: this.teleconsultation?.id,
      expediteurId: event.from?.id || null,
      expediteurType: this.detectUserRole(event.from?.id || ''),
      contenu: event.message,
      dateEnvoi: new Date().toISOString()
    };

    this.http.post<MessageDTO>('/api/messages/log', payload).subscribe({
      next: (savedMsg) => {
        this.messages.push(savedMsg);
        this.scrollToBottom();
      },
      error: (err) => console.error('Erreur lors de l’envoi du message :', err)
    });
  }

  private logEvent(payload: any): void {
    this.http.post('/api/events/log', payload).subscribe();
  }

  envoyerMessage(): void {
    if (!this.nouveauMessage.trim()) return;

    const payload: Message = {
      teleconsultationId: this.teleconsultation?.id,
      expediteurId: this.userRole === 'PATIENT' ? this.patient?.id : this.selectedMedecin?.id,
      expediteurType: this.userRole,
      contenu: this.nouveauMessage,
      dateEnvoi: new Date().toISOString()
    };

    this.http.post<MessageDTO>('/api/messages/log', payload).subscribe({
      next: (savedMsg) => {
        this.messages.push(savedMsg);
        this.nouveauMessage = '';
        this.scrollToBottom();
      },
      error: (err) => console.error('Erreur lors de l’envoi du message :', err)
    });

    // Envoi du message dans Jitsi
    this.api?.executeCommand('sendEndpointTextMessage', '', this.nouveauMessage);
  }

  private detectUserRole(userId: string): 'PATIENT' | 'PRO_SANTE' {
    return userId === this.patient?.id ? 'PATIENT' : 'PRO_SANTE';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
