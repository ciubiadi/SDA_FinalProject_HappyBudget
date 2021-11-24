import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { getLocaleDateFormat, Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TransactionModel } from 'src/app/shared/models/transaction.model';
import { TransasctionsService } from 'src/app/shared/services/transasctions.service';
import { WalletsService } from 'src/app/shared/services/wallets.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { WalletModel } from 'src/app/shared/models/wallet.model';
import { TransactionComponent } from '../transaction/transaction.component';

declare var $: any;

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  styleUrls: ['./wallet-transactions.component.scss']
})
export class WalletTransactionsComponent implements OnInit {
  walletModelObj : WalletModel = new WalletModel();

  formValue: FormGroup;
  walletId: any;
  walletData: WalletModel = new WalletModel();
  transactionModelObj: TransactionModel = new TransactionModel();
  transactionsData: any;
  showAdd!: boolean;
  displayedColumns = ['title', 'description', 'categories','type','amount','date','status','actions'];
  dataSource: MatTableDataSource<TransactionModel>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  colorControl = new FormControl('primary');
  expenses : any;
  incomes : any;
  pending : any;
  done : any;

  options!: FormGroup;

  constructor(
    private walletsService: WalletsService,
    private transactionsService: TransasctionsService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.options = formBuilder.group({
      color: this.colorControl
    });
    this.getWallet();
    this.getWalletTransactions();
    this.walletId = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
   }

  ngOnInit(): void {
    this.getWallet();
    this.getWalletTransactions();
    this.getWalletExpenses();
    this.getWalletIncomes();
    this.dataSource = new MatTableDataSource();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '550px',
      disableClose: true,
      data: {
        action: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && result.data)
      {
        console.log(result.data.date);
        this.postTransactionDetails(result.data);
      } else {
        console.log('The form was closed');
      }
    });
  }

  onEditDialog(transaction: any): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '550px',
      disableClose: true,
      data: {
        action: 'edit',
        transaction: transaction
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && result.data)
      {
        this.updateTransactionDetails(result.data);
      } else {
        console.log('The form was closed');
      }
    });
  }

  viewTransaction(transaction: any): void {
    const dialogRef = this.dialog.open(TransactionComponent, {
      width: '550px',
      data: {
        transaction: transaction
      },
    });
  }

  getWallet(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
    this.walletsService.getWallet(id)
      .subscribe(res => this.walletData = res);
  }

  getWalletTransactions(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
    this.walletsService.getWalletTransactions(id)
    .subscribe(res => {
      this.transactionsData = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getWalletExpenses(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
    this.walletsService.getWalletTransactionsType(id, 'expense')
    .subscribe(res => this.expenses = res);
  }

  getWalletIncomes(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
    this.walletsService.getWalletTransactionsType(id, 'income')
    .subscribe(res => this.incomes = res);
  }

  deleteTransaction(transaction: any) {
    this.transactionsService.deleteTransaction(transaction.id).subscribe(res => {
      // this.showNotification('Transaction Deleted Succesfully', 'warning');
      this.getWalletTransactions();
      this.getWalletExpenses();
      this.getWalletIncomes();
    });

    this.updateAtWallet();
  }

  updateTransactionDetails(data: any){
    this.transactionModelObj.id = data.id;
    this.transactionModelObj.title = data.title;
    this.transactionModelObj.walletId = this.walletId;
    this.transactionModelObj.description = data.description;
    this.transactionModelObj.type = data.type.toLowerCase();
    this.transactionModelObj.status = data.status.toLowerCase();
    this.transactionModelObj.amount = data.amount;
    this.transactionModelObj.currency = "RON";
    this.transactionModelObj.date = data.date.toLocaleDateString('en-GB');
    this.transactionModelObj.updatedAt = new Date().toLocaleDateString('en-GB');

    this.transactionsService.updateTransaction(this.transactionModelObj, this.transactionModelObj.id)
    .subscribe(res => {
      // this.showNotification('Transaction Updated Succesfully', 'info');
      this.getWalletTransactions();
      this.getWalletExpenses();
      this.getWalletIncomes();
    });

    this.updateAtWallet();
  }

  clickAddTransaction() {
    this.formValue.reset();
    this.showAdd = true;
  }

  postTransactionDetails(data: any) {
    this.transactionModelObj.id = data.id;
    this.transactionModelObj.title = data.title;
    this.transactionModelObj.walletId = this.walletId;
    this.transactionModelObj.description = data.description;
    this.transactionModelObj.type = data.type.toLowerCase();
    this.transactionModelObj.status = data.status.toLowerCase();
    this.transactionModelObj.amount = data.amount;
    this.transactionModelObj.currency = "RON";
    this.transactionModelObj.date = data.date.toLocaleDateString('en-GB');
    this.transactionModelObj.createdAt = new Date().toLocaleDateString('en-GB');
    this.transactionModelObj.updatedAt = new Date().toLocaleDateString('en-GB');

    this.transactionsService.postTransaction(this.transactionModelObj)
    .subscribe(res => {
      // this.showNotification('Transaction Added Succesfully', 'success');
      // data.reset();
      this.transactionsData.push(res);
      this.getWalletTransactions();
      this.getWalletExpenses();
      this.getWalletIncomes();
    },
    err => {
      // this.showNotification('Something went wrong', 'danger');
    });

    this.updateAtWallet();
  }

  updateAtWallet(): void {
    this.walletModelObj = this.walletData;
    this.walletModelObj.id = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
    this.walletModelObj.updatedAt = new Date().toLocaleDateString('en-GB');
    this.walletsService.updateWallet(this.walletModelObj, this.walletModelObj.id)
    .subscribe(res => {
      // this.showNotification('Wallet Updated Succesfully', 'info');
    });
  }

  goBack(): void {
    this.location.back();
  }
}
