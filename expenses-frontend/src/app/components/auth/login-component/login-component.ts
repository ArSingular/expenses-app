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

  loginRequest: LoginRequest = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/expenses']); 
      },
      error: (err) => {
        this.errorMessage = 'Невірна пошта або пароль';
        console.error('Login error:', err);
      }
    });
  }
}
