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
}

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
})
export class WalletsComponent implements OnInit {

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
      name : [''],
      owner : [''],
      description : ['']
    });
    this.dataSource = new MatTableDataSource();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(WalletFormComponent, {
      width: '550px',
      disableClose: true,
      data: {
        action: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && result.data)
      {
        this.postWalletDetails(result.data);
      } else {
        console.log('The form was closed');
      }
    });
  }

  onEditDialog(wallet: any): void {
    // console.log(wallet);
    const dialogRef = this.dialog.open(WalletFormComponent, {
      width: '550px',
      disableClose: true,
      data: {
        action: 'edit',
        walletData: wallet
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if(result!=undefined && result.data)
      {
        this.updateWalletDetails(result.data);
      } else {
        console.log('The form was closed');
      }
    });
  }

  getAllWallets() {
    this.walletsService.getWallets().subscribe(res => {
      this.walletsData = res;
      this.dataSource = new MatTableDataSource(res);
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

   postWalletDetails(data: any) {
    this.walletModelObj.name = data.name;
    // this.walletsData[0].name = this.formValue.value.walletName;
    this.walletModelObj.owner = data.owner;
    // this.walletsData[0].owner = this.formValue.value.ownerName;
    this.walletModelObj.createdAt = new Date().toLocaleDateString('en-GB');
    this.walletModelObj.updatedAt = new Date().toLocaleDateString('en-GB');
    this.walletModelObj.description = data.description;
    // this.walletsData[0].description = this.formValue.value.walletDescription;

    this.walletsService.postWallet(this.walletModelObj)
    .subscribe(res => {
      // console.log(this.walletModelObj);
      // this.showNotification('Wallet Added Succesfully', 'success');
      this.walletsData.push(res);
      this.getAllWallets();
    },
    err => {
      // this.showNotification('Something went wrong', 'danger');
    })
  }

  deleteWallet(wallet: any) {
    this.walletsService.deleteWallet(wallet.id).subscribe(res => {
      // this.showNotification('Wallet Deleted Succesfully', 'warning');
      this.getAllWallets();
    });
  }

  onEdit(wallet: any) {
    this.showAdd = false;
    // this.walletsService.setShowAdd(false);
    // this.showAdd = this.walletsService.getShowAdd();

    this.walletModelObj.id = wallet.id;
    this.formValue.controls['name'].setValue(wallet.name);
    this.formValue.controls['owner'].setValue(wallet.owner);
    this.formValue.controls['description'].setValue(wallet.description);
  }

  updateWalletDetails(data: any){
    this.walletModelObj.id = data.id;
    this.walletModelObj.name = data.name;
    this.walletModelObj.owner = data.owner;
    this.walletModelObj.description = data.description;
    this.walletModelObj.updatedAt = new Date().toLocaleDateString('en-GB');

    this.walletsService.updateWallet(this.walletModelObj, this.walletModelObj.id)
    .subscribe(res => {
      // this.showNotification('Wallet Updated Succesfully', 'info');
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
