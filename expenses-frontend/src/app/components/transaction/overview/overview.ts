import { Component, OnInit } from '@angular/core';
import { TransactionResponse, TxType } from '../../../models/transaction/transaction-response.model';
import Swal from 'sweetalert2';
import { TransactionService } from '../../../services/transaction/transaction-service';
import { TransactionRequest } from '../../../models/transaction/transaction-request.model';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview implements OnInit{

all: TransactionResponse[] = [];
  expenses: TransactionResponse[] = [];
  incomes: TransactionResponse[]  = [];

  loading = true;
  errorMessage: string | null = null;

  modalVisible = false;
  editing: TransactionResponse | null = null;
  presetType: TxType = 'EXPENSE';

  constructor(private tx: TransactionService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.tx.getTransactions().subscribe({
      next: data => {
        this.all = data;
        this.split();
        this.loading = false;
      },
      error: () => { this.errorMessage = 'Не вдалося завантажити транзакції'; this.loading = false; }
    });
  }

  private split() {
    this.expenses = this.all.filter(x => x.type === 'EXPENSE');
    this.incomes  = this.all.filter(x => x.type === 'INCOME');
  }

  // модалка
  openCreate(type: TxType) {
    this.editing = null;
    this.presetType = type;
    this.modalVisible = true;
  }
  openEdit(t: TransactionResponse) {
    this.editing = t;
    this.presetType = t.type!;
    this.modalVisible = true;
  }
  onCloseModal() { this.modalVisible = false; this.editing = null; }

  save(payload: TransactionRequest) {
    if (this.editing) {
      this.tx.updateTransaction(this.editing.id!, payload).subscribe({
        next: updated => {
          this.all = this.all.map(x => x.id === updated.id ? updated : x);
          this.split();
          this.modalVisible = false;
          this.editing = null;
          Swal.fire('Успіх', 'Транзакцію оновлено', 'success');
        },
        error: err => Swal.fire('Помилка', err?.error?.message || 'Не вдалося оновити', 'error')
      });
    } else {
      this.tx.createTransaction(payload).subscribe({
        next: created => {
          this.all = [created, ...this.all];
          this.split();
          this.modalVisible = false;
          Swal.fire('Успіх', 'Транзакцію додано', 'success');
        },
        error: err => Swal.fire('Помилка', err?.error?.message || 'Не вдалося додати', 'error')
      });
    }
  }

  confirmDelete(t: TransactionResponse) {
    Swal.fire({
      title: 'Підтвердити видалення?',
      text: `${t.type === 'EXPENSE' ? 'Витрата' : 'Дохід'}: "${t.description || t.categoryName}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Так, видалити',
      cancelButtonText: 'Скасувати'
    }).then(res => {
      if (!res.isConfirmed) return;
      this.tx.delete(t.id!).subscribe({
        next: () => {
          this.all = this.all.filter(x => x.id !== t.id);
          this.split();
          Swal.fire('Готово', 'Транзакцію видалено', 'success');
        },
        error: err => Swal.fire('Помилка', err?.error?.message || 'Не вдалося видалити', 'error')
      });
    });
  }

  get totalExpenses(): number { return (this.expenses || []).reduce((s, x) => s + (Number(x?.amount) || 0), 0); }
  get totalIncomes(): number { return (this.incomes || []).reduce((s, x) => s + (Number(x?.amount) || 0), 0); }
}
