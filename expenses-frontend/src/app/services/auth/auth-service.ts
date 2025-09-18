import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../models/auth/login-request.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { JwtResponse } from '../../models/auth/jwt-response.model';
import { RegisterRequest } from '../../models/auth/register-request.model';


const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {


    private readonly tokenKey = 'JWT_TOKEN'; 

  constructor(private http: HttpClient){}



  login(loginRequest: LoginRequest): Observable<boolean>{
    return this.http.post<any>(
      AUTH_API + 'login',loginRequest)
      .pipe(
        map(response => {
          localStorage.setItem(this.tokenKey, response.token);

          return true;
        }),
        catchError(error => {
          return throwError(() => error)
        })
      );
  }

  verify(token: string): Observable<string> {
    return this.http.get(`${AUTH_API}verify?token=${token}`, { responseType: 'text' }).pipe(
      catchError(err => {
      let message = 'Сталася помилка. Спробуй ще раз.';
      try {
        const parsed = JSON.parse(err.error);
        if (parsed?.message) message = parsed.message;
      } catch (_) {
        if (typeof err.error === 'string') message = err.error;
      }
      return throwError(() => new Error(message));
    })
  );
}
  register(registerRequest: RegisterRequest): Observable<any>{
    return this.http.post<any>(
      AUTH_API + 'register', registerRequest);
  }

   getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logount(): void{
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean{
    return !!this.getToken(); 

  }
  
}
