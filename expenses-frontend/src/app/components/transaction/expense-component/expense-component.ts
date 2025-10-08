import { Component, OnInit } from '@angular/core';
import { TransactionResponse } from '../../../models/transaction/transaction-response.model';
import { TransactionService } from '../../../services/transaction/transaction-service';
import Swal from 'sweetalert2';
import { TransactionRequest } from '../../../models/transaction/transaction-request.model';


  type SortKey = 'date'|'amount'|'category'|'description';
  type SortDir = 'asc'|'desc';


@Component({
  selector: 'app-expense-component',
  standalone: false,
  templateUrl: './expense-component.html',
  styleUrl: './expense-component.css'
})
export class ExpenseComponent implements OnInit {

    all: TransactionResponse[] = [];
    expenses: TransactionResponse[] = [];
    view: TransactionResponse[] = [];
    loading = true;
    errorMessage: string | null = null;
    modalVisible = false;
    editing: TransactionResponse | null = null;
    sortKey: SortKey = 'date';
    sortDir: SortDir = 'desc';
    search = '';
    from?: string; 
    to?: string;   
    month?: string; 
  
    private readonly ukMonthsShort = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    pieData: { name: string; value: number }[] = [];
    seriesData: { name: string; value: number }[] = [];
  
    constructor(private tx: TransactionService) {}

    ngOnInit(): void { this.load(); }


  load() {
    this.loading = true;
    this.tx.getTransactions().subscribe({
      next: data => {
        this.all = data;
        this.expenses = data.filter(x => x.type === 'EXPENSE');
        this.applyView();
        this.loading = false;
      },
      error: () => { this.errorMessage = 'Не вдалося завантажити витрати'; this.loading = false; }
    });
  }

  openCreate() { this.editing = null; this.modalVisible = true; }
  openEdit(t: TransactionResponse) { this.editing = t; this.modalVisible = true; }
  onCloseModal() { this.modalVisible = false; this.editing = null; }

  save(payload: TransactionRequest) {
    if (this.editing) {
      this.tx.updateTransaction(this.editing.id!, payload).subscribe({
        next: updated => {
          this.all = this.all.map(x => x.id === updated.id ? updated : x);
          this.expenses = this.all.filter(x => x.type === 'EXPENSE');
          this.applyView();
          this.modalVisible = false;
          this.editing = null;
          Swal.fire('Успіх', 'Витрату оновлено', 'success');
        },
        error: err => Swal.fire('Помилка', err?.error?.message || 'Не вдалося оновити', 'error')
      });
    } else {
      this.tx.createTransaction(payload).subscribe({
        next: created => {
          this.all = [created, ...this.all];
          this.expenses = this.all.filter(x => x.type === 'EXPENSE');
          this.applyView();
          this.modalVisible = false;
          Swal.fire('Успіх', 'Витрату додано', 'success');
        },
        error: err => Swal.fire('Помилка', err?.error?.message || 'Не вдалося додати', 'error')
      });
    }
  }

  confirmDelete(t: TransactionResponse) {
    Swal.fire({
      title: 'Підтвердити видалення?',
      text: t.description || t.categoryName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Так, видалити',
      cancelButtonText: 'Скасувати'
    }).then(res => {
      if (!res.isConfirmed) return;
      this.tx.delete(t.id!).subscribe({
        next: () => {
          this.all = this.all.filter(x => x.id !== t.id);
          this.expenses = this.all.filter(x => x.type === 'EXPENSE');
          this.applyView();
          Swal.fire('Готово', 'Витрату видалено', 'success');
        },
        error: err => Swal.fire('Помилка', err?.error?.message || 'Не вдалося видалити', 'error')
      });
    });
  }

  onSort(key: SortKey) {
    this.sortKey = key;
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.applyView();
  }
  onSearch(term: string) { this.search = term; this.applyView(); }
  onFrom(date: string) { this.from = date || undefined; this.applyView(); }
  onTo(date: string) { this.to = date || undefined; this.applyView(); }
  onMonth(m?: string) { this.month = m || undefined; this.applyView(); }

  formatMonthLabel = (val: string) => {
    if (!val) return '';
    const [y, m] = val.split('-');
    const mi = Math.max(1, Math.min(12, parseInt(m, 10))) - 1;
    return `${this.ukMonthsShort[mi]} ${y}`
  };

  private applyView() {
    let arr = [...this.expenses];

    if (this.from) arr = arr.filter(x => x.date!.slice(0,10) >= this.from!);
    if (this.to)   arr = arr.filter(x => x.date!.slice(0,10) <= this.to!);
    if (this.month) arr = arr.filter(x => x.date!.slice(0,7) === this.month);

    if (this.search) {
      const q = this.search.toLowerCase();
      arr = arr.filter(x =>
        (x.description || '').toLowerCase().includes(q) ||
        (x.categoryName || '').toLowerCase().includes(q)
      );
    }

    const dir = this.sortDir === 'asc' ? 1 : -1;
    arr.sort((a,b) => {
      switch (this.sortKey) {
        case 'date': return (a.date! < b.date! ? -1 : a.date! > b.date! ? 1 : 0) * dir;
        case 'amount': return ((a.amount||0) - (b.amount||0)) * dir;
        case 'category': return a.categoryName!.localeCompare(b.categoryName!) * dir;
        case 'description': return (a.description||'').localeCompare(b.description||'') * dir;
      }
    });

    this.view = arr;
    this.recalcCharts(arr);
  }

  private recalcCharts(arr: TransactionResponse[]) {
    const byCat = new Map<string, number>();
    for (const t of arr) byCat.set(t.categoryName!, (byCat.get(t.categoryName!) || 0) + Number(t.amount||0));
    const sorted = Array.from(byCat, ([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value);
    const TOP = 8;
    const top = sorted.slice(0, TOP);
    const restSum = sorted.slice(TOP).reduce((s,x)=>s+x.value,0);
    this.pieData = restSum > 0 ? [...top, { name: 'Інші', value: restSum }] : top;

    const byMonth = new Map<string, number>();
    for (const t of arr) {
      const key = t.date!.slice(0,7);
      byMonth.set(key, (byMonth.get(key) || 0) + Number(t.amount||0));
    }
    this.seriesData = Array.from(byMonth, ([name, value]) => ({ name, value }))
      .sort((a,b) => a.name.localeCompare(b.name));
  }

  get total(): number {
    return this.view.reduce((s,x)=>s+(Number(x.amount)||0),0);
  }
}
