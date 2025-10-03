export type TxType = 'INCOME' | 'EXPENSE'

export class TransactionRequest {
        type?: TxType;
        amount?: number;
        categoryId?: number;
        description?: string;
        date?: string;
}
