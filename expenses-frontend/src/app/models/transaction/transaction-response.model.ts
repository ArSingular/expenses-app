export type TxType = 'INCOME' | 'EXPENSE'
export type CategoryKind = 'INCOME' | 'EXPENSE'

export class TransactionResponse {

    id?: number;
    type?: TxType;
    amount?: number;
    categoryId?: number;
    categoryName?: string;
    categoryKind?: CategoryKind;
    description?: string;
    date?: string;

}
