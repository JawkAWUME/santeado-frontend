import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Planification } from '../../interfaces/planification';
import { Observable } from 'rxjs';
import { Teleconsultation } from '../../interfaces/teleconsultation';
import { Message } from '../../interfaces/message';
import { MessageDTO } from '../../interfaces/message.dto';

@Injectable({
  providedIn: 'root'
})
export class TeleconsultationService {
  private apiUrl = 'http://localhost:10001/api/teleconsultations'; 
  
  constructor(private http: HttpClient) { }

  planifier(dto: Planification): Observable<Teleconsultation> {
    return this.http.post<Teleconsultation>(`${this.apiUrl}/planifier`, dto);
  }

  envoyerMessage(teleconsultationId:number, dto: MessageDTO): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/${teleconsultationId}/messages`, dto);
  }

  getMessages(teleconsultationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${teleconsultationId}/messages`);
  }
}
