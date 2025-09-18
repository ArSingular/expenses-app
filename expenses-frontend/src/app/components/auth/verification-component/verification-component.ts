import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verification-component',
  standalone: false,
  templateUrl: './verification-component.html',
  styleUrl: './verification-component.css'
})
export class VerificationComponent implements OnInit{

  
  errorMessage: string | null = null;

   constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (!token) {
        Swal.fire({
        icon: 'error',
        title: 'Помилка 🚨',
        text: 'Токен не знайдено у посиланні',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ff0000'
          }).then(() => this.router.navigate(['/login']));
        return;
      }

      this.authService.verify(token).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Верифікація пройшла успішно🎉',
            text: res ,
            confirmButtonText: 'Увійти',
            confirmButtonColor: '#008000'
          }).then(() => this.router.navigate(['/login']));
        },
        error: (err) => {
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
      }).then(() => this.router.navigate(['/login']));
        }
      });
    });
  }

}
