import { NgModule } from '@angular/core';
import { CategoriesModule } from './categories/categories.module';
import { CustomerModule } from './customer/customer.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginModule } from './login/login.module';
import { ProductsModule } from './products/products.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    LoginModule,
    DashboardModule,
    ProfileModule,
    CustomerModule,
    CategoriesModule,
    ProductsModule
  ]
})
export class MainModule { }
