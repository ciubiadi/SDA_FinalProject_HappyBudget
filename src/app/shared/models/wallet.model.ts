import { TransactionModel } from "./transaction.model";

export class WalletModel {
    id : number = 0;
    name : string = '';
    owner : string = '';
    description : string = '';
    transactions?: TransactionModel[];
}