import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login-component/login-component';
import { RegisterComponent } from './components/auth/register-component/register-component';
import { authGuard } from './util/auth-guard';
import { guestGuard } from './util/guest-guard';
import { ProfileComponent } from './components/user/profile-component/profile-component';
import { VerificationComponent } from './components/auth/verification-component/verification-component';
import { Overview } from './components/transaction/overview/overview';
import { IncomeComponent } from './components/transaction/income-component/income-component';
import { ExpenseComponent } from './components/transaction/expense-component/expense-component';


const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'me', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'verify', component: VerificationComponent },
  { path: 'overview', component: Overview, canActivate: [authGuard] },
  { path: 'incomes', component: IncomeComponent, canActivate: [authGuard] },
  { path: 'expenses', component: ExpenseComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/overview', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
