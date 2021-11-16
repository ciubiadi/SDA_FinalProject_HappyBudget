import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WalletModel } from 'src/app/shared/models/wallet.model';
import { WalletsService } from 'src/app/shared/services/wallets.service';
import {MatTableModule} from '@angular/material/table';

declare var $: any;

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
})
export class WalletsComponent implements OnInit {

  /*Supa*/
  // wallets: WalletModel[];
  // wallet: WalletModel;
  // actionLabel: string;
  /*Supa End*/

  walletWord !: any;
  
  formValue !: FormGroup;
  walletModelObj : WalletModel = new WalletModel();
  walletsData !: any;
  showAdd!: boolean;

  displayedColumns : string[] = ['name','budget','owner','description','actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private walletsService: WalletsService,
    private formBuilder: FormBuilder,
  ) { 
    this.getAllWallets();
  }

  ngOnInit(): void {
    this.getAllWallets();
    this.formValue =  this.formBuilder.group({
      walletName : [''],
      ownerName : [''],
      walletDescription : [''] 
    });
    this.dataSource = new MatTableDataSource();
  }

  getAllWallets() {
    this.walletsService.getWallets().subscribe(res => {
      this.walletsData = res;
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clickAddWallet() {
    this.formValue.reset();
    this.showAdd = true;
    // this.walletsService.setShowAdd(true);
    // this.showAdd = this.walletsService.getShowAdd();
  }

   postWalletDetails() {
    this.walletModelObj.name = this.formValue.value.walletName;
    // this.walletsData[0].name = this.formValue.value.walletName;
    this.walletModelObj.owner = this.formValue.value.ownerName;
    // this.walletsData[0].owner = this.formValue.value.ownerName;
    this.walletModelObj.description = this.formValue.value.walletDescription;
    // this.walletsData[0].description = this.formValue.value.walletDescription;

    this.walletsService.postWallet(this.walletModelObj)
    .subscribe(res => {
      console.log(this.walletModelObj);
      this.showNotification('Wallet Added Succesfully', 'success');
      let ref = document.getElementById('cancel');
      ref?.click() ;
      this.formValue.reset();
      this.walletsData.push(res);
    },
    err => {
      this.showNotification('Something went wrong', 'danger');
    })
  }

  deleteWallet(wallet: any) {
    this.walletsService.deleteWallet(wallet.id).subscribe(res => {
      this.showNotification('Wallet Deleted Succesfully', 'warning');
      this.getAllWallets();
    });
  }

  onEdit(wallet: any) {
    this.showAdd = false;
    // this.walletsService.setShowAdd(false);
    // this.showAdd = this.walletsService.getShowAdd();

    this.walletModelObj.id = wallet.id;
    this.formValue.controls['walletName'].setValue(wallet.name);
    this.formValue.controls['ownerName'].setValue(wallet.owner);
    this.formValue.controls['walletDescription'].setValue(wallet.description);
  }

  updateWalletDetails(){
    this.walletModelObj.name = this.formValue.value.walletName;
    this.walletModelObj.owner = this.formValue.value.ownerName;
    this.walletModelObj.description = this.formValue.value.walletDescription;
 
    this.walletsService.updateWallet(this.walletModelObj, this.walletModelObj.id)
    .subscribe(res => {
      this.showNotification('Wallet Updated Succesfully', 'info');
      let ref = document.getElementById('cancel');
      ref?.click() ;
      this.formValue.reset(); 
      this.getAllWallets();
    });
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

  // addWallet() {
  //   if (this.wallet.id) {
  //     //Update if exists ID{
  //     this.update();
  //     return;
  //   }
  //   this.api
  //     .addWallet(this.wallet)
  //     .then((payload) => {
  //       this.wallets.push(payload.data[0]);
  //     })
  //     .catch((err) => console.log(`Error in add WALLET ${err}`));
  //   this.clear();
  // }

  // editWallet(wallet: WalletModel) {
  //   this.wallet = wallet;
  //   this.actionLabel = 'UPDATE';
  // }

  // update() {
  //   this.api.update(this.wallet).then(() => {
  //     let foundIndex = this.wallets.findIndex((t) => t.id == this.wallet.id);
  //     this.wallets[foundIndex] = this.wallet;
  //     this.clear();
  //   });
  // }

  // checkWallet(walletCheck: WalletModel) {
  //   walletCheck.done = !walletCheck.done;
  //   this.api.updateCheck(walletCheck);
  // }

  // delete(wallet: WalletModel) {
  //   this.api
  //     .deleteWallet(wallet.id)
  //     .then((res) => {
  //       (this.wallets = this.arrayRemove(this.wallets, wallet.id));
  //       // console.log('res', res.data)
  //     });

  // }

  // arrayRemove(arr: WalletModel[], id: number) {
  //   return arr.filter((ele) => ele.id != id);
  // }

  // clear() {
  //   this.wallet = new WalletModel();
  //   this.actionLabel = 'ADD';
  // }
}
