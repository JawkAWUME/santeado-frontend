import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from '../../interfaces/auth.request';
import { AuthResponse } from '../../interfaces/auth.response';
import { User } from '../../interfaces/user';
import { RegisterRequest } from '../../interfaces/register.request';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:10001/api/auth'; 

  constructor(private http: HttpClient) {}

  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, req);
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, req);
  }

  saveToken(token: string, role: string, fromLogin: boolean = false): void {
    localStorage.setItem('jwt', token);
    localStorage.setItem('role', role);

    // ✅ Ne mettre hasLoggedInOnce à true que si ça vient d’un login
    if (fromLogin) {
      localStorage.setItem('hasLoggedInOnce', 'true');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const hasLoggedInOnce = localStorage.getItem('hasLoggedInOnce') === 'true';
    return !!token && hasLoggedInOnce; // vrai uniquement après login
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('hasLoggedInOnce');
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }
}
