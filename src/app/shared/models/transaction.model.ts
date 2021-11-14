export class TransactionModel {
    id: number = 0;
    title: string = "";
    type: string = "";
    walletId: number = 0;
    date: Date = new Date();
    description:string = "";
    amount: number = 0;
    currency: string = "";
}