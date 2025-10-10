import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TransactionResponse, TxType } from '../../../models/transaction/transaction-response.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category/category-service';
import { TransactionRequest } from '../../../models/transaction/transaction-request.model';
import { CategoryTreeDTO } from '../../../models/category/category-tree-dto.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();

  form = this.fb.group({
    type: this.fb.control<TxType>('EXPENSE', { nonNullable: true }),
    categoryId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    amount: this.fb.control<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
    date: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control<string>('')
  });

  searchCtrl = new FormControl<string>('', { nonNullable: true });

  tree: CategoryTreeDTO[] = [];
  filteredRoots: CategoryTreeDTO[] = [];
  hoverRoot: CategoryTreeDTO | null = null;
  hoverChild: CategoryTreeDTO | null = null;

  categoryPicked = false;
  pickedLabel = '';

  createMode = false;
  createCatName = '';
  createCatError = '';
  createCatTouched = false;
  createParentId: number | null = null;
  createParentLabel = 'Корінь';

  private idToPath = new Map<number, CategoryTreeDTO[]>();

  ngOnInit(): void {
    this.form.controls.type.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(kind => this.loadTree(kind));

    this.searchCtrl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(q => {
        this.applyFilter(q || '');
        const first = this.firstMatchInRoots(this.filteredRoots, (q || '').toLowerCase());
        if (first) setTimeout(() => this.revealPath(first.id, { scroll: true }), 0);
      });
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
      this.categoryPicked = !!this.transaction.categoryId;
      this.loadTree(this.transaction.type!);
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
      this.categoryPicked = false;
      this.pickedLabel = '';
      this.loadTree(this.presetType);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTree(kind: TxType) {
    this.categoriesApi.getTree(kind).subscribe(raw => {
      this.tree = this.normalizeTree(raw || []);
      this.rebuildIndex();
      this.applyFilter(this.searchCtrl.value || '');
      const cid = this.form.value.categoryId;
      if (typeof cid === 'number') {
        this.revealPath(cid, { scroll: false });
        setTimeout(() => this.pickedLabel = this.buildPathLabel(cid), 0);
      } else {
        this.hoverRoot = null;
        this.hoverChild = null;
      }
    });
  }

  openCreateCategory() {
    this.createMode = true;
    this.createCatName = '';
    this.createCatError = '';
    this.createCatTouched = false;
    const fixed = this.hoverChild ?? this.hoverRoot ?? null;
    this.createParentId = fixed?.id ?? null;
    this.createParentLabel = fixed ? this.buildPathLabel(fixed.id) : 'Корінь';
  }

  cancelCreateCategory() {
    this.createMode = false;
    this.createCatName = '';
    this.createCatError = '';
    this.createCatTouched = false;
    this.createParentId = null;
    this.createParentLabel = 'Корінь';
  }

  submitCreateCategory() {
    this.createCatTouched = true;
    this.createCatError = '';
    const name = (this.createCatName ?? '').trim();
    if (!name) return;

    const kind = this.form.controls.type.value!;
    const parentId = this.createParentId;

    this.categoriesApi.createCategory({ name, kind, parentId }).subscribe({
      next: (created) => {
        this.loadTree(kind);
        setTimeout(() => {
          this.revealPath(created.id!, { scroll: true });
          this.form.controls.categoryId.setValue(created.id!);
          this.pickedLabel = this.buildPathLabel(created.id!);
          this.categoryPicked = true;
          this.hoverRoot = null; this.hoverChild = null;
          this.cancelCreateCategory();
        }, 0);
      },
      error: (err) => { this.createCatError = err?.error?.message || 'Не вдалося створити категорію'; }
    });
  }

  onHoverRoot(n: CategoryTreeDTO) { this.hoverRoot = n; this.hoverChild = null; }
  onHoverChild(n: CategoryTreeDTO) { this.hoverChild = n; }

  onPick(n: CategoryTreeDTO) {
    if (this.createMode) {
      this.createParentId = n.id;
      this.createParentLabel = this.buildPathLabel(n.id);
      return;
    }
    this.form.controls.categoryId.setValue(n.id);
    this.pickedLabel = this.buildPathLabel(n.id);
    this.categoryPicked = true;
    this.hoverRoot = null;
    this.hoverChild = null;
    setTimeout(() => document.querySelector<HTMLInputElement>('input[formControlName="amount"]')?.focus(), 0);
  }

  editCategory() {
    this.categoryPicked = false;
    const cid = this.form.value.categoryId;
    if (typeof cid === 'number') this.revealPath(cid, { scroll: true });
  }

  private normalizeTree(tree: any[]): CategoryTreeDTO[] {
    const fix = (n: any): CategoryTreeDTO => ({
      id: Number(n?.id),
      name: String(n?.name ?? ''),
      kind: (n?.kind === 'INCOME' || n?.kind === 'EXPENSE') ? n.kind : 'EXPENSE',
      children: Array.isArray(n?.children) ? n.children.map(fix) : []
    });
    return Array.isArray(tree) ? tree.map(fix) : [];
  }

  private rebuildIndex() {
    this.idToPath.clear();
    const walk = (n: CategoryTreeDTO, path: CategoryTreeDTO[]) => {
      const cur = [...path, n];
      this.idToPath.set(n.id, cur);
      for (const ch of n.children) walk(ch, cur);
    };
    for (const r of this.tree) walk(r, []);
  }

  applyFilter(input: string) {
    const q = (input || '').toLowerCase().trim();
    if (!q) { this.filteredRoots = this.tree; return; }
    this.filteredRoots = this.tree.filter(n => this.matchesDeep(n, q));
  }

  private matchesDeep(n: CategoryTreeDTO, q: string): boolean {
    if (n.name.toLowerCase().includes(q)) return true;
    for (const ch of n.children) if (this.matchesDeep(ch, q)) return true;
    return false;
  }

  private firstMatchInRoots(roots: CategoryTreeDTO[], q: string): CategoryTreeDTO | null {
    if (!q) return null;
    for (const root of roots) {
      const hit = this.firstMatch(root, q);
      if (hit) return hit;
    }
    return null;
  }

  private firstMatch(node: CategoryTreeDTO, q: string): CategoryTreeDTO | null {
    if (node.name.toLowerCase().includes(q)) return node;
    for (const ch of node.children) {
      const r = this.firstMatch(ch, q);
      if (r) return r;
    }
    return null;
  }

  private buildPathLabel(id: number): string {
    const path = this.idToPath.get(id) || [];
    return path.map(p => p.name).join(' › ') || `ID: ${id}`;
  }

  private revealPath(id: number, opts?: { scroll?: boolean }) {
    const path = this.idToPath.get(id);
    if (!path || path.length === 0) { this.hoverRoot = null; this.hoverChild = null; return; }
    this.hoverRoot = path[0] || null;
    this.hoverChild = path[1] && this.hoverRoot && this.hoverRoot.id !== path[1].id ? path[1] : null;
    if (opts?.scroll) setTimeout(() => this.scrollToPath(path), 0);
  }

  private scrollToPath(path: CategoryTreeDTO[]) {
    const root = path[0];
    const child = path[1];
    const leaf = path[path.length - 1];
    document.querySelector<HTMLButtonElement>(`[data-node="root-${root?.id}"]`)?.scrollIntoView({ block: 'nearest' });
    if (child) document.querySelector<HTMLButtonElement>(`[data-node="child-${child.id}"]`)?.scrollIntoView({ block: 'nearest' });
    document.querySelector<HTMLButtonElement>(`[data-node="leaf-${leaf?.id}"]`)?.scrollIntoView({ block: 'nearest' });
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