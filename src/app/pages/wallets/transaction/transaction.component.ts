import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionCategoryModel } from 'src/app/shared/models/category-transaction.model';
import { WalletModel } from 'src/app/shared/models/wallet.model';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { WalletsService } from 'src/app/shared/services/wallets.service';
import { DialogData } from '../wallets.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  transaction: any;
  walletData: WalletModel = new WalletModel();
  transactionCategories: Array<TransactionCategoryModel>;

  constructor(
    public dialogRef: MatDialogRef<TransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private walletService: WalletsService,
    private categoryService: CategoriesService,
    private formBuilder: FormBuilder
  ) {
   }

  ngOnInit(): void {
    this.transaction = this.data['transaction'];
    this.getWallet(this.transaction.walletId);
    this.getCategory();
    // console.log(this.transactionCategories);
    this.data['transaction'].categories.foreach(categoryId => console.log(categoryId));
  }

  getWallet(walletId: number): void {
    this.walletService.getWallet(walletId)
      .subscribe(res => this.walletData = res);
  }

  getCategory(): void {
    // this.transaction.categories.foreach(categoryId => {
    //   this.categoryService.getCategory(categoryId).
    //     subscribe(res => this.transactionCategories.push(res));
    // });
    // console.log(this.transaction.categories);
  }

}
