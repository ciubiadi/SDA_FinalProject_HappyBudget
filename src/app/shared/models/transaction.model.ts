export class TransactionModel {
    id: number = 0;
    title: string = "";
    type: string = "";
    walletId: number = 0;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    // date: string = "";
    description:string = "";
    amount: number = 0;
    categpries: string ="";
    people: string="";
    currency: string = "";
}