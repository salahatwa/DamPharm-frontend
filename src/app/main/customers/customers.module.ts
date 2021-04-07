import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/modules/shared.module';
import { AuthModule } from './../../shared/services/auth/auth.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomersComponent } from './customers.component';


@NgModule({
  declarations: [CustomersComponent,CustomerListComponent,CustomerComponent],
  imports: [
    SharedModule,
    AuthModule,
    CommonModule
  ]
})
export class CustomersModule { }
