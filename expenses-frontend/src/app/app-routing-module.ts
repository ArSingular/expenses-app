import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login-component/login-component';
import { ExpensesList } from './components/expense/expenses-list/expenses-list';
import { RegisterComponent } from './components/auth/register-component/register-component';
import { authGuard } from './util/auth-guard';
import { guestGuard } from './util/guest-guard';
import { ProfileComponent } from './components/user/profile-component/profile-component';
import { VerificationComponent } from './components/auth/verification-component/verification-component';


const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'expenses', component: ExpensesList, canActivate: [authGuard] },
  { path: 'me', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'verify', component: VerificationComponent },
  { path: '', redirectTo: '/expenses', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
