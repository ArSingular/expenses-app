export type CategoryKind = 'INCOME' | 'EXPENSE'

export class CategoryDTO {

        id?: number;
        name?: string;
        kind?: CategoryKind;
        parentId?: number | null;

}
