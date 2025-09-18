import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user-service';
import { UserResponse } from '../../../models/user/user-response.model';

@Component({
  selector: 'app-profile-component',
  standalone: false,
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css'
})
export class ProfileComponent implements OnInit {

  user: UserResponse | null = null;
  editMode = false;
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService){}

 ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (data) => (this.user = data),
      error: (err) => (this.errorMessage = 'Не вдалося завантажити дані користувача')
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    this.successMessage = '';
    this.errorMessage = '';
  }

    saveChanges() {
    if (!this.user) return;
    this.userService.updateUser(this.user).subscribe({
      next: (updated) => {
        this.user = updated;
        this.editMode = false;
        this.successMessage = 'Зміни збережено успішно';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Помилка при збереженні';
        this.successMessage = '';
      }
    });
  }

}
