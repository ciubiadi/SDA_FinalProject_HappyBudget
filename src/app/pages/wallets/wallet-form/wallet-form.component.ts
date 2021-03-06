import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WalletsComponent } from '../wallets.component';
import { DialogData } from '../wallets.component';

@Component({
  selector: 'app-wallet-form',
  templateUrl: './wallet-form.component.html',
  styleUrls: ['./wallet-form.component.scss']
})
export class WalletFormComponent implements OnInit {

  showAdd: any;

  formValue !: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<WalletsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if(this.data['action'] == 'add'){
      this.formValue =  this.formBuilder.group({
        name : [''],
        owner : [''],
        description : [''] 
      });
      this.showAdd = true;
    } else {
      this.formValue =  this.formBuilder.group({
        id : this.data['walletData']['id'],
        name : this.data['walletData']['name'],
        owner : this.data['walletData']['owner'],
        description : this.data['walletData']['description'] 
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
