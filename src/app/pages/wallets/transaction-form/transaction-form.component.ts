
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TransactionTypes } from 'src/app/shared/services/transasctions.service';
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

  StateTransactionTypes = TransactionTypes;
  enumTransactionTypes=[];

  constructor(
    // public dialogRef: MatDialogRef<WalletFormComponent>, !!DON'T KNOW WHICH VARIANT IS CORRECT!!!
    public dialogRef: MatDialogRef<WalletTransactionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) {
    this.enumTransactionTypes=Object.keys(this.StateTransactionTypes);
   }

  ngOnInit(): void {

    if(this.data['action'] == 'add'){
      this.formValue =  this.formBuilder.group({
        title : [''],
        description : [''],
        type : [''],
        amount: [''],
        date: null,
      });
      this.showAdd = true;
    } else {
      this.formValue =  this.formBuilder.group({
        id : this.data['transaction']['id'],
        title : this.data['transaction']['title'],
        type : this.data['transaction']['type'],
        description : this.data['transaction']['description'],
        amount: this.data['transaction']['amount'],
        date: this.data['transaction']['date']
      });
      this.showAdd = false;
    }
  }

  submit(): void {
    console.log('transaction-form_submit: ');
    console.log(this.formValue);
    this.dialogRef.close({data: this.formValue.value});
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}
