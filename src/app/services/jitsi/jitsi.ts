import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface JitsiTokenResponse {
  token:string;
}
@Injectable({
  providedIn: 'root'
})
export class JitsiService {
  constructor (private http:HttpClient) {}

  getToken(roomName: string, userName: string, userEmail?: string): Observable<JitsiTokenResponse> {
    let params = new HttpParams()
      .set('roomName', roomName)
      .set('userName', userName);

    if (userEmail) {
      params = params.set('userEmail', userEmail);
    }

    return this.http.get<JitsiTokenResponse>('/api/jitsi-token', { params });
  }
}
