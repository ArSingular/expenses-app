import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseResponse } from '../../models/expense/expense-response.model';
import { ExpenseRequest } from '../../models/expense/expense-request.model';
import { ExpenseUpdateRequest } from '../../models/expense/expense-update-request.model';


const baseUrl = 'http://localhost:8080/api/expenses';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient){}

  createExpense(payload: ExpenseRequest):Observable<ExpenseResponse>{
    return this.http.post<ExpenseResponse>(`${baseUrl}`, payload);
  }

  getExpenses():Observable<ExpenseResponse[]>{
    return this.http.get<ExpenseResponse[]>(baseUrl);
  }

  updateExpense(id:number, payload: ExpenseUpdateRequest){
    return this.http.put<ExpenseResponse>(`${baseUrl}/${id}`, payload);
  }

  deleteExpense(id: number){
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }

}
