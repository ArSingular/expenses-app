import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFormModal } from './expense-form-modal';

describe('ExpenseFormModal', () => {
  let component: ExpenseFormModal;
  let fixture: ComponentFixture<ExpenseFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
