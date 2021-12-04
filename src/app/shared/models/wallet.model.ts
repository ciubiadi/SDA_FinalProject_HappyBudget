import { TransactionModel } from "./transaction.model";

export class WalletModel {
    id : number = 0;
    name : string = '';
    budget : number = 0;
    owner : string = '';
    createdAt: string = "";
    updatedAt: string = "";
    description : string = '';
    transactions?: TransactionModel[];
}
