import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { UserResponse } from '../../models/user/user-response.model';
import { UpdateUserRequest } from '../../models/user/update-user-request.model';
import { ChangeEmailResponse } from '../../models/user/change-email-response.model';

const USER_API = 'http://localhost:8080/api/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  private userCache$?: Observable<UserResponse>;

  getUser(): Observable<UserResponse> {
    if (!this.userCache$) {
      this.userCache$ = this.http.get<UserResponse>(`${USER_API}/me`).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.userCache$;
  }

  refreshUser(): void {
    this.userCache$ = undefined;
  }

  updateUser(user: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${USER_API}/me`, user).pipe(
      tap(() => this.refreshUser())
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${USER_API}/me/password`, { oldPassword, newPassword });
  }

  updateEmail(newEmail: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${USER_API}/me/email`, { newEmail });
  }

  confirmEmailChange(newEmail: string, otp: string): Observable<ChangeEmailResponse> {
    return this.http.post<ChangeEmailResponse>(`${USER_API}/me/email/confirm`, { newEmail, otp }).pipe(
      tap(() => this.refreshUser())
    );
  }
}
