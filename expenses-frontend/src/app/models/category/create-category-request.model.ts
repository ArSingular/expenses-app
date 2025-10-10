export type CategoryKind = 'INCOME' | 'EXPENSE'

export class CreateCategoryRequest {

  name!: string;
  kind!: CategoryKind;
  parentId!: number | null;

}
