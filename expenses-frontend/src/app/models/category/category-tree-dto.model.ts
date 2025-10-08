export type Kind = 'INCOME' | 'EXPENSE';

export interface CategoryTreeDTO {
  id: number;
  name: string;
  kind: Kind;
  children: CategoryTreeDTO[];
}