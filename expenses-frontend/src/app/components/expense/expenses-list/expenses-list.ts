import { Component, OnInit} from '@angular/core';
import { ExpenseResponse } from '../../../models/expense/expense-response.model';
import { ExpenseService } from '../../../services/expense/expense-service';
import Swal from 'sweetalert2';
import { ExpenseUpdateRequest } from '../../../models/expense/expense-update-request.model';


@Component({
  selector: 'app-expenses-list',
  standalone: false,
  templateUrl: './expenses-list.html',
  styleUrl: './expenses-list.css'
})

export class ExpensesList implements OnInit{


  expenses: ExpenseResponse[] = [];
  loading = true;
  errorMessage: string | null = null;

  modalVisible = false;
  editingExpense: ExpenseResponse | null = null;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  private loadExpenses() {
    this.loading = true;
    this.expenseService.getExpenses().subscribe({
      next: (data) => { this.expenses = data; this.loading = false; },
      error: (e) => { this.errorMessage = 'Не вдалося завантажити витрати'; this.loading = false; }
    });
  }

  openCreate() {
    this.editingExpense = null;
    this.modalVisible = true;
  }

  openEdit(expense: ExpenseResponse) {
    this.editingExpense = expense;
    this.modalVisible = true;
  }

  saveExpense(data: ExpenseUpdateRequest) {
    if (this.editingExpense) {
      this.expenseService.updateExpense(this.editingExpense.id!, data).subscribe({
        next: (updated) => {
          this.expenses = this.expenses.map(x => x.id === updated.id ? updated : x);
          this.modalVisible = false;
          Swal.fire('✅ Успіх', 'Витрату оновлено', 'success');
        },
        error: (err) => Swal.fire('🚨 Помилка', err?.error?.message || 'Не вдалося оновити витрату', 'error')
      });
    } else {
      this.expenseService.createExpense(data).subscribe({
        next: (created) => {
          this.expenses = [created, ...this.expenses];
          this.modalVisible = false;
          Swal.fire('✅ Успіх', 'Витрату додано', 'success');
        },
        error: (err) => Swal.fire('🚨 Помилка', err?.error?.message || 'Не вдалося додати витрату', 'error')
      });
    }
  }

  confirmDelete(e: ExpenseResponse) {
    Swal.fire({
      title: 'Підтвердити видалення?',
      text: `Видалити: "${e.description}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Так, видалити',
      cancelButtonText: 'Скасувати'
    }).then((res) => {
      if (!res.isConfirmed || !e.id) return;

      this.expenseService.deleteExpense(e.id).subscribe({
        next: () => {
          this.expenses = this.expenses.filter(x => x.id !== e.id);
          Swal.fire('🗑 Видалено!', 'Витрату видалено', 'success');
        },
        error: (err) => Swal.fire('🚨 Помилка', err?.error?.message || 'Не вдалося видалити витрату', 'error')
      });
    });
  }

  getCategoryEmoji(category?: string): string {
  switch (category) {
    case 'FOOD': return '🍔';
    case 'TRANSPORT': return '🚌';
    case 'HEALTH': return '💊';
    case 'ENTERTAINMENT': return '🎉';
    case 'OTHER': return '📦';
    default: return '❓';
  }
}

getCategoryName(category?: string): string {
  switch (category) {
    case 'FOOD': return 'Їжа';
    case 'TRANSPORT': return 'Транспорт';
    case 'HEALTH': return 'Здоровʼя';
    case 'ENTERTAINMENT': return 'Розваги';
    case 'OTHER': return 'Інше';
    default: return 'Невідомо';
  }
}

getCategoryClass(category?: string): string {
  switch (category) {
    case 'FOOD': return 'bg-warning text-dark';
    case 'TRANSPORT': return 'bg-info text-dark';
    case 'HEALTH': return 'bg-success';
    case 'ENTERTAINMENT': return 'bg-primary';
    case 'OTHER': return 'bg-secondary';
    default: return 'bg-dark';
  }
}

onCloseModal() {
  this.modalVisible = false;
  this.editingExpense = null;
}

}
