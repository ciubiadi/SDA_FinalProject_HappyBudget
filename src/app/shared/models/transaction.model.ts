import { TransactionCategoryModel } from "./category-transaction.model";

export class TransactionModel {
    id: number = 0;
    title: string = "";
    type: string = "";
    status: string ="";
    walletId: number = 0;
    date: string ="";
    createdAt: string = "";
    updatedAt: string = "";
    description:string = "";
    amount: number = 0;
    people: string="";
    currency: string = "";
    categories?: TransactionCategoryModel[];
}
