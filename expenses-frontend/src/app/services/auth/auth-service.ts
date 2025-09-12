import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../models/auth/login-request.model';
import { catchError, map, Observable, of } from 'rxjs';
import { JwtResponse } from '../../models/auth/jwt-response.model';


const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient){}

    isLoggedIn: boolean = false;


  login(loginRequest: LoginRequest): Observable<boolean>{
    return this.http.post<any>(
      AUTH_API + 'login',loginRequest)
      .pipe(
        map(response => {
          localStorage.setItem('JWT_Token', response.token);
          this.isLoggedIn = true;
          return true;
        }),
        catchError(error => {
          console.log(error);
          this.isLoggedIn = false;
          return of(false);
        })
      )
  }

  logount(): void{
    localStorage.removeItem('JWT_TOKEN');
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean{
    return this.isLoggedIn;
  }
  
}
