import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../../../models/auth/login-request.model';
import { AuthService } from '../../../services/auth/auth-service';
import { StorageService } from '../../../services/auth/storage-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent{

  loginRequest: LoginRequest = new LoginRequest();
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/expenses']); 
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message; 
        } else {
          this.errorMessage = 'Сталася невідома помилка';
        }
      }
    });
  }
}
