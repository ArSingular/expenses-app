import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseResponse } from '../../models/expense/expense-response.model';


const baseUrl = 'http://localhost:8080/api/expenses';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient){}

  getExpenses():Observable<ExpenseResponse[]>{
    return this.http.get<ExpenseResponse[]>(baseUrl);
  }

}
