import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { ExpensesList } from './components/expense/expenses-list/expenses-list';
import { LoginComponent } from './components/auth/login-component/login-component';
import { httpInterceptorProviders } from './util/http.interceptor';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    ExpensesList,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    httpInterceptorProviders
  ],
  bootstrap: [App]
})
export class AppModule { }
