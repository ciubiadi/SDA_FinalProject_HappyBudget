import { TransactionModel } from "./transaction.model";

export class WalletModel {
    id : number = 0;
    name : string = '';
    owner : string = '';
    // createdAt: Date = new Date();
    createdAt: string = "";
    updatedAt: string = "";
    description : string = '';
    transactions?: TransactionModel[];
}