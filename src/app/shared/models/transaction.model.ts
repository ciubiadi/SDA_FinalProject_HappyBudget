import { TransactionCategoryModel } from "./transaction-categories.model";

export class TransactionModel {
    id: number = 0;
    title: string = "";
    type: string = "";
    walletId: number = 0;
    date: Date = new Date();
    createdAt: string = "";
    updatedAt: string = "";
    // date: string = "";
    description:string = "";
    amount: number = 0;
    categpries: string ="";
    people: string="";
    currency: string = "";
    categories?: TransactionCategoryModel[];
}