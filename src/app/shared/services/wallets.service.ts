import { Injectable } from '@angular/core';
// import { Transaction } from './transaction.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { WalletModel } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletsService {

  private walletsUrl = 'http://localhost:3000/wallets/';  // URL to web api
  // private walletsUrl = 'https://jsonware.com/json/39557ece0136b6df9fb4090f90755034.json';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // walletsData : WalletModel[] = [];
  
  // showAdd!: boolean;

  constructor(
    private http: HttpClient
    ) { }

    /* WALLETS */
    postWallet(data : any) {
      return this.http.post<any>(this.walletsUrl, data)
      .pipe(map((res : any) => {
        return res;
      }))
    }
  
    getWallets() {
      return this.http.get<any>(this.walletsUrl)
      .pipe(map((res : any) => {
        return res;
      }))
    }

    getWallet(id: number) {
      return this.http.get<any>(this.walletsUrl + id)
      .pipe(map((res : any) => {
        return res;
      }))
    }

    getWalletTransactions(id: number) {
      return this.http.get<any>(this.walletsUrl + id + "/transactions")
      .pipe(map((res : any) => {
        return res;
      }))
    }

    getWalletTransactionsType(id: number, type: string) {
      return this.http.get<any>(this.walletsUrl + id + "/transactions?type=" + type)
      .pipe(map((res : any) => {
        return res;
      }))
    }
    
      // public getWallets(): Observable<Wallet[]> {
  //   return this.http.get<Wallet[]>('http://localhost:3000/wallets');
  // }
  
    updateWallet(data :any, id: number) {
      return this.http.put<any>(this.walletsUrl + id, data)
      .pipe(map((res : any) => {
        return res;
      }))
    }
  
    deleteWallet(id: number) {
      return this.http.delete<any>(this.walletsUrl + id)
      .pipe(map((res : any) => {
        return res;
      }))
    }

  // public retrieveInitialWallets(): void {
  //   this.getWallets().subscribe( res => {
  //     this.walletsData = res;
  //   });
  // }
}

// export interface Wallet {
//   id: number;
//   name: string;
//   owner: string;
//   description: string;
//   transactions?: Transaction[];
// }


