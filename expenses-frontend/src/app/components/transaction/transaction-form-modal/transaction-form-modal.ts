import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TransactionResponse, TxType } from '../../../models/transaction/transaction-response.model';
import { CategoryDTO } from '../../../models/category/category-dto.model';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category/category-service';
import { TransactionRequest } from '../../../models/transaction/transaction-request.model';

@Component({
  selector: 'app-transaction-form-modal',
  standalone: false,
  templateUrl: './transaction-form-modal.html',
  styleUrl: './transaction-form-modal.css'
})
export class TransactionFormModal implements OnInit, OnChanges{

    @Input() visible = false;
  @Input() transaction: TransactionResponse | null = null;
  @Input() presetType: TxType = 'EXPENSE';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TransactionRequest>();

  private fb = inject(FormBuilder);
  private categoriesApi = inject(CategoryService);

  form = this.fb.group({
    type: this.fb.control<TxType>('EXPENSE', { nonNullable: true }),
    categoryId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    amount: this.fb.control<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
    date: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control<string>('')
  });

  categories: CategoryDTO[] = [];
  indented: { id: number; label: string }[] = [];

  ngOnInit(): void {
    this.form.controls.type.valueChanges.subscribe(kind => this.loadCategories(kind));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.visible) return;

    if (this.transaction) {
      this.form.patchValue({
        type: this.transaction.type!,
        categoryId: this.transaction.categoryId!,
        amount: this.transaction.amount!,
        date: (this.transaction.date || '').split('T')[0],
        description: this.transaction.description || ''
      });
      this.loadCategories(this.transaction.type!);
    } else {
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.form.reset({
        type: this.presetType,
        categoryId: null,
        amount: 0,
        date: `${today.getFullYear()}-${mm}-${dd}`,
        description: ''
      });
      this.loadCategories(this.presetType);
    }
  }

  loadCategories(kind: TxType) {
    this.categoriesApi.list(kind).subscribe(list => {
      this.categories = list;
      this.indented = this.buildIndented(list);

      const cid = this.form.value.categoryId;
      if (cid != null && !this.categories.some(c => c.id === cid)) {
        this.form.controls.categoryId.setValue(null);
      }
    });
  }

  private buildIndented(list: CategoryDTO[]) {
    const byParent = new Map<number | null, CategoryDTO[]>();
    for (const c of list) {
      const key = (c.parentId == null || c.parentId === 0 ? null : c.parentId);
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(c);
    }
    for (const arr of byParent.values()) arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const out: { id: number; label: string }[] = [];
    const walk = (pid: number | null, depth: number) => {
      for (const c of byParent.get(pid) || []) {
        out.push({ id: c.id!, label: `${'— '.repeat(depth)}${c.name}` });
        walk(c.id!, depth + 1);
      }
    };
    walk(null, 0);
    return out;
  }

  onSubmit() {
    if (this.form.invalid) return;
    const payload: TransactionRequest = {
      type: this.form.value.type!,
      amount: this.form.value.amount!,
      categoryId: this.form.value.categoryId!,
      description: this.form.value.description || '',
      date: this.form.value.date!
    };
    this.save.emit(payload);
  }
}
