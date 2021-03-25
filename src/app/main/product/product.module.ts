import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/modules/shared.module';
import { AuthModule } from './../../shared/services/auth/auth.module';
import { ProductComponent } from './product.component';



@NgModule({
  declarations: [ProductComponent],
  imports: [
    SharedModule,
    AuthModule,
    CommonModule
  ]
})
export class ProductModule { }
