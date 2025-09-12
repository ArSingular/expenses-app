import { Component, OnInit } from '@angular/core';
import { ExpenseResponse } from '../../../models/expense/expense-response.model';
import { ExpenseService } from '../../../services/expense/expense-service';

@Component({
  selector: 'app-expenses-list',
  standalone: false,
  templateUrl: './expenses-list.html',
  styleUrl: './expenses-list.css'
})
export class ExpensesList implements OnInit{

  expenses: ExpenseResponse[] = [];
  currentExpense: ExpenseResponse = {};
  currentIndex = -1;
  loading = true;
  errorMessage: string | null = null;

  constructor(private expenseService: ExpenseService){}

  ngOnInit(): void {
    this.retrieveExpenses();
  }

  private retrieveExpenses(): void{
    this.expenseService.getExpenses()
    .subscribe({
      next: (data) => {
        this.expenses = data;
        console.log(data);
        this.loading = false;
      },
      error: (e) => {
        this.errorMessage = 'Не вдалося завантажити витрати';
        this.loading = false;
        console.error('Expenses error:', e);
      }
    })
  }

  setActiveExpense(expense: ExpenseResponse, index: number){
    this.currentExpense = expense;
    this.currentIndex = index;
  }




}
