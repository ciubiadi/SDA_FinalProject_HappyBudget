import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WalletModel } from 'src/app/shared/models/wallet.model';
import { WalletsService } from 'src/app/shared/services/wallets.service';
import { MatDialog } from '@angular/material/dialog';
import { WalletFormComponent } from './wallet-form/wallet-form.component';

declare var $: any;
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
})
export class WalletsComponent implements OnInit {

  animal: string;
  name: string;

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
    public dialog: MatDialog
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

  openDialog(): void {
    const dialogRef = this.dialog.open(WalletFormComponent, {
      width: '250px',
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
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
}
