import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WalletsService } from 'src/app/shared/services/wallets.service';
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
  walletsData !: any;

  constructor(
    // public dialogRef: MatDialogRef<WalletFormComponent>,
    public dialogRef: MatDialogRef<WalletsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private walletsService: WalletsService
  ) { }

  ngOnInit(): void {
    this.getAllWallets();
    if(this.data['action'] == 'add'){
      this.formValue =  this.formBuilder.group({
        walletName : [''],
        ownerName : [''],
        walletDescription : [''] 
      });
      this.showAdd = true;
    } else {
      this.formValue =  this.formBuilder.group({
        walletName : this.data['walletData']['name'],
        ownerName : this.data['walletData']['owner'],
        walletDescription : this.data['walletData']['description'] 
      });
      this.showAdd = false;
    }
  }

  getAllWallets() {
    this.walletsService.getWallets().subscribe(res => {
      this.walletsData = res;
    })
  }

  add(): void {
    this.dialogRef.close({data: 'you added'});
  }

  update(): void {
    this.dialogRef.close({data: 'you updated'});
  }

  cancel(): void {
    this.dialogRef.close({data: 'you canceled'});
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}
