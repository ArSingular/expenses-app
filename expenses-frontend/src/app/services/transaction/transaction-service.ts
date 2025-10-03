import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionResponse } from '../../models/transaction/transaction-response.model';
import { TransactionRequest } from '../../models/transaction/transaction-request.model';


const baseUrl = 'http://localhost:8080/api/transactions';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  
  constructor(private http: HttpClient){}


  createTransaction(payload: TransactionRequest):Observable<TransactionResponse>{
    return this.http.post<TransactionResponse>(`${baseUrl}`, payload);
  }

  getTransactions():Observable<TransactionResponse[]>{
    return this.http.get<TransactionResponse[]>(baseUrl);
  }

  updateTransaction(id: number, payload: TransactionRequest):Observable<TransactionResponse>{
    return this.http.put<TransactionResponse>(`${baseUrl}/${id}`, payload);
  }

  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }

}
