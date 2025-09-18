import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../models/user/user-response.model';


const USER_API = 'http://localhost:8080/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  

  constructor(private http: HttpClient){}

  public getUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${USER_API}/me`);
  }

  public updateUser(user: Partial<UserResponse>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${USER_API}/update`, user);
  }

}
