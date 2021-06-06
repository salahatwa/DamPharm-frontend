import { NgModule } from '@angular/core';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginModule } from './login/login.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoice/invoices.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    LoginModule,
    DashboardModule,
    ProfileModule,
    CustomersModule,
    CategoriesModule,
    ProductsModule,
    InvoicesModule
  ]
})
export class MainModule { }
