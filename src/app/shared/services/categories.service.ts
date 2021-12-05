import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { WalletModel } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categoriesUrl = 'http://localhost:3000/categories/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

   /* CATEGORIES */
   postCategory(data : any) {
    return this.http.post<any>(this.categoriesUrl, data)
    .pipe(map((res : any) => {
      return res;
    }))
  }

  getCategories() {
    return this.http.get<any>(this.categoriesUrl)
    .pipe(map((res : any) => {
      return res;
    }))
  }

  getCategory(id: number) {
    return this.http.get<any>(this.categoriesUrl + id)
    .pipe(map((res : any) => {
      return res;
    }))
  }

  updateWallet(data :any, id: number) {
    return this.http.put<any>(this.categoriesUrl + id, data)
    .pipe(map((res : any) => {
      return res;
    }))
  }

  deleteWallet(id: number) {
    return this.http.delete<any>(this.categoriesUrl + id)
    .pipe(map((res : any) => {
      return res;
    }))
  }
}
