import { NgModule } from '@angular/core';
import { CustomerModule } from './customer/customer.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginModule } from './login/login.module';
import { CategoriesModule } from './categories/categories.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    LoginModule,
    DashboardModule,
    ProfileModule,
    CustomerModule,
    CategoriesModule
  ]
})
export class MainModule { }
