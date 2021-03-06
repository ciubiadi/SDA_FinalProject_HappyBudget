import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { WalletsComponent } from 'src/app/pages/wallets/wallets.component';
import { WalletTransactionsComponent } from 'src/app/pages/wallets/wallet-transactions/wallet-transactions.component';
import { CategoriesComponent } from 'src/app/pages/categories/categories.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',            component: DashboardComponent },
    { path: 'wallets',              component: WalletsComponent},
    { path: 'categories',           component: CategoriesComponent},
    { path: 'wallets/:walletId',    component: WalletTransactionsComponent},
    { path: 'user-profile',         component: UserProfileComponent },
];
