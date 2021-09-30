import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { AuthModule } from '../../shared/services/auth/auth.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoicesComponent } from './invoices.component';
import { PaidDialogComponent } from './update-status/paid-dialog/paid-dialog.component';
import { ReturnsDialogComponent } from './update-status/returns-dialog/returns-dialog.component';


@NgModule({
  declarations: [InvoicesComponent, InvoiceListComponent, InvoiceComponent,PaidDialogComponent,ReturnsDialogComponent],
  imports: [
    SharedModule,
    AuthModule,
    CommonModule
  ]
})
export class InvoicesModule { }
