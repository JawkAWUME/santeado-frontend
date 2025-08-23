import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from '../../interfaces/auth.request';
import { AuthResponse } from '../../interfaces/auth.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:10001/api/auth'; // adapte selon ton backend
  constructor(private http: HttpClient) { }

  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, req);
  }

  register(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, req);
  }

  saveToken(token: string, role: string): void {
    localStorage.setItem('jwt', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Vérifie si le token existe
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
  }
}
