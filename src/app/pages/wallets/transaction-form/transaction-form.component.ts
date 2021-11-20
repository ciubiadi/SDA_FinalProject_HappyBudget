
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WalletTransactionsComponent } from '../wallet-transactions/wallet-transactions.component';
import { DialogData } from '../wallets.component';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {

  showAdd: any;

  formValue !: FormGroup;

  constructor(
    // public dialogRef: MatDialogRef<WalletFormComponent>, !!DON'T KNOW WHICH VARIANT IS CORRECT!!!
    public dialogRef: MatDialogRef<WalletTransactionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    if(this.data['action'] == 'add'){
      this.formValue =  this.formBuilder.group({
        title : [''],
        description : [''],
        type : [''],
        amount: [''],
        date: [''] 
      });
      this.showAdd = true;
    } else {
      this.formValue =  this.formBuilder.group({
        id : this.data['transactionData']['id'],
        title : this.data['transactionData']['title'],
        type : this.data['transactionData']['type'],
        description : this.data['transactionData']['description'],
        amount: this.data['transactionData']['amount'],
        date: this.data['transactionData']['date'] 
      });
      this.showAdd = false;
    }
  }

  submit(): void {
    this.dialogRef.close({data: this.formValue.value});
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}
