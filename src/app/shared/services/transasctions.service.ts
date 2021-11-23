import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransasctionsService {

  private transactionsUrl = 'http://localhost:3000/transactions/';

  constructor(private http : HttpClient) { }

  getTransactions() {
    return this.http.get<any>(this.transactionsUrl)
    .pipe(map((res : any) => {
      return res;
    }))
  }

  postTransaction(data : any) {
    return this.http.post<any>(this.transactionsUrl, data)
    .pipe(map((res : any) => {
      return res;
    }))
  }

  updateTransaction(data :any, id: number) {
    return this.http.put<any>(this.transactionsUrl + id, data)
    .pipe(map((res : any) => {
      return res;
    }))
  }

  deleteTransaction(id: number) {
    return this.http.delete<any>(this.transactionsUrl + id)
    .pipe(map((res : any) => {
      return res;
    }))
  }
}

export enum TransactionTypes {
  Expense = 'expense',
  Income = 'income'
}

export enum TransactionStatuses {
  Pending = 'pending',
  Done = 'done'
}

export enum CurrencyTypes {
  EUR = 'EUR',
  RON = 'RON'
}

// export interface Transaction {
//   id: number;
//   type: TransactionTypes;
//   walletId: number;
//   date: Date;
//   description: string;
//   amount: number;
//   currency: CurrencyTypes
// }
