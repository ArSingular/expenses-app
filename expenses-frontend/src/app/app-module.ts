import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpensesList } from './components/expense/expenses-list/expenses-list';
import { LoginComponent } from './components/auth/login-component/login-component';
import { httpInterceptorProviders } from './util/http.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/auth/register-component/register-component';
import { HeaderComponent } from './components/header/header-component/header-component';
import { ProfileComponent } from './components/user/profile-component/profile-component';
import { VerificationComponent } from './components/auth/verification-component/verification-component';
import { ExpenseFormModal } from './components/expense/expense-form-modal/expense-form-modal';

@NgModule({
  declarations: [
    App,
    ExpensesList,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    ProfileComponent,
    VerificationComponent,
    ExpenseFormModal
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    httpInterceptorProviders
  ],
  bootstrap: [App]
})
export class AppModule { }
