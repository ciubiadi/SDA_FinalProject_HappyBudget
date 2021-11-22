import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WalletModel } from 'src/app/shared/models/wallet.model';
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

  constructor(
    public dialogRef: MatDialogRef<TransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private walletService: WalletsService,
    private formBuilder: FormBuilder
  ) {
   }

  ngOnInit(): void {
    this.transaction = this.data['transaction'];
    this.getWallet(this.transaction.walletId);
  }

  getWallet(walletId: number): void {
    this.walletService.getWallet(walletId)
      .subscribe(res => this.walletData = res);
  }

}
