import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth/login-component/login-component';
import { httpInterceptorProviders } from './util/http.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/auth/register-component/register-component';
import { HeaderComponent } from './components/header/header-component/header-component';
import { ProfileComponent } from './components/user/profile-component/profile-component';
import { VerificationComponent } from './components/auth/verification-component/verification-component';
import { Overview } from './components/transaction/overview/overview';
import { TransactionFormModal } from './components/transaction/transaction-form-modal/transaction-form-modal';
import { IncomeComponent } from './components/transaction/income-component/income-component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PieChartComponent } from './components/chart/pie-chart-component/pie-chart-component';
import { BarChartComponent } from './components/chart/bar-chart-component/bar-chart-component';
import { ExpenseComponent } from './components/transaction/expense-component/expense-component';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    ProfileComponent,
    VerificationComponent,
    Overview,
    TransactionFormModal,
    IncomeComponent,
    PieChartComponent,
    BarChartComponent,
    ExpenseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    httpInterceptorProviders
  ],
  bootstrap: [App]
})
export class AppModule { }
