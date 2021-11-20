import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TransactionModel } from 'src/app/shared/models/transaction.model';
import { TransasctionsService } from 'src/app/shared/services/transasctions.service';
import { WalletsService } from 'src/app/shared/services/wallets.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { MatDialog } from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  styleUrls: ['./wallet-transactions.component.scss']
})
export class WalletTransactionsComponent implements OnInit {
  // walletModelObj : WalletModel = new WalletModel();
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
    public dialog: MatDialog
  ) {
    this.options = formBuilder.group({
      color: this.colorControl
    });
    this.getWalletTransactions();
    this.walletId = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
   }

  ngOnInit(): void {
    this.getWalletTransactions();
    this.formValue =  this.formBuilder.group({
      title : [''],
      type : [''],
      description : [''],
      amount : [''],
      date: ['']
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
      console.log('wallets-transactions_openDialog: ');
      console.log(result);
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
      console.log('wallets-transactions_onEditDialog: ');
      console.log(result);
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

  postTransaction() {
    const id = parseInt(this.route.snapshot.paramMap.get('walletId')!, 10);
    let date = new Date('dd/mm/yyyy');
    // let finalDate = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear(); 
    // console.log(finalDate);
    this.transactionModelObj.title = this.formValue.value.title;
    this.transactionModelObj.description = this.formValue.value.description;
    this.transactionModelObj.amount = this.formValue.value.amount;
    this.transactionModelObj.type = this.formValue.value.type;
    this.transactionModelObj.walletId = id;
    // this.transactionModelObj.date = new Date();
    this.transactionModelObj.date = 'test';
    this.transactionModelObj.currency = this.formValue.value.currency;


    this.transactionsService.postTransaction(this.transactionModelObj)
    .subscribe(res => {
      console.log(this.transactionModelObj);
      alert("Transaction Added Succesfully");
      this.formValue.reset();
      this.transactionsData.push(res);
      this.getWalletTransactions();
    },
    err => {
      alert("Something went wrong");
    })
  }

  onEdit(transaction: any) {
    this.showAdd = false;

    this.transactionModelObj.id = transaction.id;
    this.formValue.controls['title'].setValue(transaction.title);
    this.formValue.controls['type'].setValue(transaction.type);
    this.formValue.controls['description'].setValue(transaction.description);
    this.formValue.controls['amount'].setValue(transaction.amount);
    this.formValue.controls['date'].setValue(transaction.date);
  }

  deleteTransaction(transaction: any) {
    this.transactionsService.deleteTransaction(transaction.id).subscribe(res => {
      // this.showNotification('Transaction Deleted Succesfully', 'warning');
      this.getWalletTransactions();
    });
  }

  updateTransactionDetails(data: any){
    this.transactionModelObj.id = data.id;
    this.transactionModelObj.title = data.title;
    this.transactionModelObj.walletId = this.walletId;
    this.transactionModelObj.description = data.description;
    this.transactionModelObj.type = data.type;
    this.transactionModelObj.amount = data.amount;
    this.transactionModelObj.currency = "RON";
    this.transactionModelObj.date = data.date;
 
    this.transactionsService.updateTransaction(this.transactionModelObj, this.transactionModelObj.id)
    .subscribe(res => {
      // this.showNotification('Transaction Updated Succesfully', 'info');
      let ref = document.getElementById('cancel');
      ref?.click() ;
      this.formValue.reset(); 
      this.getWalletTransactions();
    });
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
    this.transactionModelObj.type = data.type;
    this.transactionModelObj.amount = data.amount;
    this.transactionModelObj.currency = "RON";
    this.transactionModelObj.date = data.date;

    console.log('wallet-transactions_postTransactionDetails: ');
    console.log(data);
    this.transactionsService.postTransaction(this.transactionModelObj)
    .subscribe(res => {
      console.log(this.transactionModelObj);
      // this.showNotification('Transaction Added Succesfully', 'success');
      // data.reset();
      this.transactionsData.push(res);
      this.getWalletTransactions();
    },
    err => {
      // this.showNotification('Something went wrong', 'danger');
    })
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
