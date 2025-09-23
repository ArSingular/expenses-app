import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginRequest } from '../../models/auth/login-request.model';
import { RegisterRequest } from '../../models/auth/register-request.model';

const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly tokenKey = 'JWT_TOKEN';

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.http.post<{ token: string }>(AUTH_API + 'login', loginRequest, httpOptions).pipe(
      map(resp => {
        localStorage.setItem(this.tokenKey, resp.token);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  verify(token: string): Observable<string> {
    return this.http.get(`${AUTH_API}verify?token=${encodeURIComponent(token)}`, { responseType: 'text' }).pipe(
      catchError((err: HttpErrorResponse) => {
        let message = 'Сталася помилка. Спробуй ще раз.';
        if (typeof err.error === 'string') {
          message = err.error;
        } else if (err.error?.message) {
          message = err.error.message;
        }
        return throwError(() => new Error(message));
      })
    );
  }

  register(registerRequest: RegisterRequest): Observable<void> {
    return this.http.post<void>(AUTH_API + 'register', registerRequest, httpOptions);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  changeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
