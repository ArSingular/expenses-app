import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth-service';
import { RegisterRequest } from '../../../models/auth/register-request.model';

type RegisterForm = FormGroup<{
  username: import('@angular/forms').FormControl<string>;
  email: import('@angular/forms').FormControl<string>;
  password: import('@angular/forms').FormControl<string>;
}>;

@Component({
  selector: 'app-register-component',
  standalone: false,
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css']
})
export class RegisterComponent implements OnInit {

  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form!: RegisterForm;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      username: this.fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
      email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
      password: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)] })
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const request: RegisterRequest = this.form.getRawValue();

    const Toast = Swal.mixin({ toast: true, position: 'top', showConfirmButton: false, timer: 1800, timerProgressBar: true });
    Toast.fire({ icon: 'info', title: 'Реєструємо…' });

    this.auth.register(request).subscribe({
      next: async () => {
        this.errorMessage = null;
        Toast.fire({ icon: 'success', title: 'Лист для верифікації надіслано' });

        await Swal.fire({
          icon: 'success',
          title: 'Реєстрація успішна 🎉',
          text: 'Ми надіслали лист для верифікації на пошту. Перевір Inbox або Spam.',
          confirmButtonText: 'Добре'
        });
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        this.successMessage = null;
        this.errorMessage = err?.error?.message || 'Сталася помилка. Спробуй ще раз.';
        await Swal.fire({ icon: 'error', title: 'Помилка 🚨', text: this.errorMessage ?? 'Сталася помилка. Спробуй ще раз.', confirmButtonText: 'Ok' });
      }
    });
  }

  get f() { return this.form.controls; }
}
