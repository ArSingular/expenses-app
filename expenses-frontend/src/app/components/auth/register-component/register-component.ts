import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from '../../../models/auth/register-request.model';
import { AuthService } from '../../../services/auth/auth-service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-component',
  standalone: false,
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup; 
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['',Validators.required, Validators.minLength(2)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

onSubmit() {
  if (this.form.invalid) return;

  const request: RegisterRequest = this.form.value as RegisterRequest;

  this.auth.register(request).subscribe({
    next: () => {
      this.errorMessage = null;

      Swal.fire({
        icon: 'success',
        title: 'Реєстрація успішна 🎉',
        text: 'Ми надіслали лист для верифікації на твою пошту. Перевір Inbox або Spam 😉',
        confirmButtonText: 'Добре',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        this.router.navigate(['/login']); 
      });
    },
    error: (err) => {
      this.successMessage = null;
      if (err.error?.message) {
        this.errorMessage = err.error.message;
      } else {
        this.errorMessage = "Сталася помилка. Спробуй ще раз.";
      }
      Swal.fire({
        icon: 'error',
        title: 'Помилка 🚨',
        text: this.errorMessage + '',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ff0000'
      });
    }
  });
}
}
