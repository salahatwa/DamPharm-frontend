import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AuthModule } from 'src/app/shared/services/auth/auth.module';
import { CustomerComponent } from './customer.component';



@NgModule({
  declarations: [CustomerComponent],
  imports: [
    SharedModule,
    AuthModule,
    CommonModule
  ]
})
export class CustomerModule { }
