import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutModule } from './main/app-layout.module';
import { CustomersComponent } from './main/customers/customers.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LayoutComponent } from './main/layout.component';
import { ProfileComponent } from './main/profile/profile.component';
import { AboutComponent } from './shared/components/about.component';
import { ErrorComponent } from './shared/components/error.component';
import { AuthGuard } from './shared/services/auth/auth-guard.service';
import { CategoriesComponent } from './main/categories/categories.component';
import { ProductsComponent } from './main/products/products.component';
import { InvoicesComponent } from './main/invoice/invoices.component';
import { InvoiceListComponent } from './main/invoice/invoice-list/invoice-list.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
    // { path: 'login', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        data: { title: 'dashboard.title' }
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                loadChildren: () => AppLayoutModule,
                data: { title: 'dashboard.title' }
            },
            {
                path: 'customers',
                component: CustomersComponent,
                loadChildren: () => AppLayoutModule
            },
            {
                path: 'categories',
                component: CategoriesComponent,
                loadChildren: () => AppLayoutModule
            },
            {
                path: 'products',
                component: ProductsComponent,
                loadChildren: () => AppLayoutModule
            },
            {
                path: 'invoices',
                component: InvoicesComponent,
                loadChildren: () => AppLayoutModule
            },
            //invoices-list
            {
                path: 'invoices-list',
                component: InvoiceListComponent,
                loadChildren: () => AppLayoutModule
            },
            {
                path: 'profile',
                component: ProfileComponent,
                loadChildren: () => AppLayoutModule,
                data: { title: 'profile.title' }
            }
        ]
    },
    { path: '404', component: ErrorComponent },
    { path: 'about', component: AboutComponent },
    { path: '**', component: ErrorComponent, pathMatch: 'full' }
], { useHash: false, initialNavigation: 'enabled' })
  ],
  declarations: [
    ErrorComponent,
    AboutComponent
  ],
  providers: [AuthGuard],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
