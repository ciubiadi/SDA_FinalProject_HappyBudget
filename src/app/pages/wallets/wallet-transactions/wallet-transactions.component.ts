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

declare var $: any;

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  styleUrls: ['./wallet-transactions.component.scss']
})
export class WalletTransactionsComponent implements OnInit {
  walletModelObj : WalletModel = new WalletModel();
  // transactionModelObj : TransactionModel | undefined;

  formValue !: FormGroup;
  walletId !: any;
  walletData !: any;
  transactionModelObj : TransactionModel = new TransactionModel();
  transactionsData !: any;
  showAdd!: boolean;
  displayedColumns = ['title', 'description','type','amount','date','actions'];
  dataSource: MatTableDataSource<TransactionModel>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  colorControl = new FormControl('primary');
  expenses : any;
  incomes : any;
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
    this.walletData = this.getWallet();
    this.getWalletTransactions();
    this.getWalletExpenses();
    this.getWalletIncomes();

    this.formValue =  this.formBuilder.group({
      title : [''],
      type : [''],
      description : [''],
      amount : [''],
      date: null,
    });
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
      data: {
        action: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && result.data)
      {
        this.postTransactionDetails(result.data);
      } else {
        console.log('The form was closed');
      }
    });
  }

  onEditDialog(transaction: any): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '550px',
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

  onEdit(transaction: any) {
    this.showAdd = false;

    this.transactionModelObj.id = transaction.id;
    this.formValue.controls['title'].setValue(transaction.title);
    this.formValue.controls['type'].setValue(transaction.type);
    this.formValue.controls['description'].setValue(transaction.description);
    this.formValue.controls['amount'].setValue(transaction.amount);
    this.formValue.controls['date'].setValue(transaction.updatedAt);
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
    this.transactionModelObj.amount = data.amount;
    this.transactionModelObj.currency = "RON";
    // this.transactionModelObj.createdAt = data.createdAt.toLocaleDateString('en-GB');
    this.transactionModelObj.updatedAt = data.date.toLocaleDateString('en-GB')
 
    this.transactionsService.updateTransaction(this.transactionModelObj, this.transactionModelObj.id)
    .subscribe(res => {
      // this.showNotification('Transaction Updated Succesfully', 'info');
      let ref = document.getElementById('cancel');
      ref?.click() ;
      this.formValue.reset(); 
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
    this.transactionModelObj.amount = data.amount;
    this.transactionModelObj.currency = "RON";
    this.transactionModelObj.createdAt = data.date.toLocaleDateString('en-GB');
    this.transactionModelObj.updatedAt = data.date.toLocaleDateString('en-GB');

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

  showNotification(msg, typeColor){
    let iconType = '';
    switch(typeColor) {
      case 'danger':
        iconType = 'error_outline';
        break;
      case 'warning':
        iconType = 'delete_forever';
        break;
      case 'success':
        iconType = 'task_alt';
        break;
      default:
        iconType = 'notifications'
    }
    $.notify({
        title: iconType,
        message: msg
    },{
        type: typeColor,
        timer: 50000,
        placement: {
            from: 'bottom',
            align: 'right'
        },
        template: 
        '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">{1}</i> ' +
          // '<span data-notify="title"></span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }
}
