import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
  }

  storeSession(token: string, userId: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : 0;
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
