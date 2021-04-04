import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CategoriesModule } from '../categories/categories.module';
import { SharedModule } from './../../shared/modules/shared.module';
import { AuthModule } from './../../shared/services/auth/auth.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products.component';


@NgModule({
  declarations: [ProductsComponent, ProductListComponent, ProductComponent],
  imports: [
    SharedModule,
    AuthModule,
    CommonModule,
    CategoriesModule
  ]
})
export class ProductsModule { }
