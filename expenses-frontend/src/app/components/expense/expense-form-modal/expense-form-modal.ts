import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ExpenseResponse } from '../../../models/expense/expense-response.model';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-form-modal',
  standalone: false,
  templateUrl: './expense-form-modal.html',
  styleUrl: './expense-form-modal.css'
})
export class ExpenseFormModal {

  @Input() visible = false;
  @Input() expense: ExpenseResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  categories = ['FOOD','TRANSPORT','HEALTH','ENTERTAINMENT','OTHER'];

  
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    description: ['', Validators.required],
    category: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required]
  });



  ngOnChanges() {
    if (this.expense) {
      this.form.patchValue({
        description: this.expense.description,
        category: this.expense.category,
        amount: this.expense.amount,
        date: this.expense.date?.split('T')[0]
      });
    } else {
       const today = new Date();
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const dd = String(today.getDate()).padStart(2,'0');
    this.form.reset({ description: '', category: '', amount: 0, date: `${today.getFullYear()}-${mm}-${dd}` });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}

