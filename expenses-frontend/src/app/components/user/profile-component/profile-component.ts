import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../services/user/user-service';
import { AuthService } from '../../../services/auth/auth-service';
import Swal from 'sweetalert2';
import { UpdateUserRequest } from '../../../models/user/update-user-request.model';
import { firstValueFrom, shareReplay } from 'rxjs';

@Component({
  selector: 'app-profile-component',
  standalone: false,
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.css']
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private auth = inject(AuthService);

  user$ = this.userService.getUser(); 

  editProfileMode = false;
  profileUpdate: UpdateUserRequest = new UpdateUserRequest();

  editEmailMode = false;
  newEmail = '';

  oldPassword = '';
  newPassword = '';

  ngOnInit(): void {}

  async toggleEditProfile() {
    this.editProfileMode = !this.editProfileMode;
    if (this.editProfileMode) {
      try {
        const u = await firstValueFrom(this.user$);
        this.profileUpdate = { username: u.username, email: u.email };
      } catch {
        await Swal.fire('Помилка 🚨', 'Не вдалося завантажити дані користувача', 'error');
        this.editProfileMode = false;
      }
    }
  }

  async saveProfile() {
    const name = (this.profileUpdate?.username || '').trim();
    if (!name) {
      await Swal.fire('Уупс ⚠️', 'Введіть ім’я користувача', 'warning');
      return;
    }
    const payload: UpdateUserRequest = { username: name };
    try {
      await firstValueFrom(this.userService.updateUser(payload));
      this.user$ = this.userService.getUser(); 
      this.editProfileMode = false;
      await Swal.fire('Успіх 🎉', 'Профіль оновлено', 'success');
    } catch (err: any) {
      await Swal.fire('Помилка 🚨', err?.error?.message || 'Помилка при збереженні', 'error');
    }
  }

  async toggleEditEmail() {
    this.editEmailMode = !this.editEmailMode;
    if (this.editEmailMode) {
      try {
        const u = await firstValueFrom(this.user$);
        this.newEmail = u.email || '';
      } catch {
        await Swal.fire('Помилка 🚨', 'Не вдалося завантажити дані користувача', 'error');
        this.editEmailMode = false;
      }
    }
  }

  private isValidEmail(v: string): boolean {
    const e = v.trim();
    return !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

async startEmailChange() {
  const u = await firstValueFrom(this.user$);
  const email = (this.newEmail || '').trim();

  if (!this.isValidEmail(email) || email.toLowerCase() === (u.email || '').toLowerCase()) {
    await Swal.fire('Уупс ⚠️', 'Введіть іншу коректну email-адресу', 'warning');
    return;
  }

  const Toast = Swal.mixin({ toast: true, position: 'top', showConfirmButton: false, timer: 1500 });
  Toast.fire({ icon: 'info', title: 'Надсилаємо код…' });

  try {
    const resp = await firstValueFrom(this.userService.updateEmail(email));
    Toast.fire({ icon: 'success', title: resp.message || 'Код надіслано' });

    const result = await Swal.fire({
      title: 'Введи 6-значний код',
      input: 'text',
      inputAttributes: { maxlength: '6', inputmode: 'numeric', autocapitalize: 'off', autocomplete: 'one-time-code' },
      showCancelButton: true,
      confirmButtonText: 'Підтвердити',
      cancelButtonText: 'Скасувати',
      allowOutsideClick: () => !Swal.isLoading(),
      inputValidator: (v) => (!v || !/^\d{6}$/.test(v) ? 'Введи рівно 6 цифр' : undefined),
      preConfirm: async (otp) => {
        try {
          Swal.showLoading(); 
          const res = await firstValueFrom(this.userService.confirmEmailChange(email, otp));
          if (res?.token) this.auth.changeToken(res.token);
          this.user$ = this.userService.getUser();
          this.editEmailMode = false;
          return true;
        } catch (err: any) {
          Swal.hideLoading();
          Swal.showValidationMessage(err?.error?.message || 'Невірний або прострочений код');
          return false;
        }
      }
    });

    if (result.isConfirmed) {
      await Swal.fire('Успіх 🎉', 'Email оновлено', 'success');
    }
  } catch (err: any) {
    await Swal.fire('Помилка 🚨', err?.error?.message || 'Пошта вже використовується чи помилка відправки', 'error');
  }
}

  hasMinLength(p: string) { return p.length >= 6; }
  hasNumber(p: string) { return /[0-9]/.test(p); }
  hasLetter(p: string) { return /[a-zA-Z]/.test(p); }
  hasSpecial(p: string) { return /[!@#$%^&*()_+\-=]/.test(p); }
  isPasswordValid(p: string) {
    const v = p.trim();
    return this.hasMinLength(v) && this.hasNumber(v) && this.hasLetter(v) && this.hasSpecial(v);
  }

  async changePassword() {
    const oldP = (this.oldPassword || '').trim();
    const newP = (this.newPassword || '').trim();

    if (!oldP) { await Swal.fire('Уупс ⚠️', 'Введіть старий пароль', 'warning'); return; }
    if (!newP) { await Swal.fire('Уупс ⚠️', 'Введіть новий пароль', 'warning'); return; }
    if (!this.isPasswordValid(newP)) {
      await Swal.fire('Уупс ⚠️', 'Пароль має містити мінімум 6 символів, цифру, букву і спецсимвол', 'warning'); return;
    }

    try {
      await firstValueFrom(this.userService.changePassword(oldP, newP));
      this.oldPassword = '';
      this.newPassword = '';
      await Swal.fire('Успіх 🎉', 'Пароль змінено успішно', 'success');
    } catch (err: any) {
      await Swal.fire('Помилка 🚨', err?.error?.message || 'Помилка при збереженні', 'error');
    }
  }


}
