import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutModule } from './main/app-layout.module';
import { CustomerComponent } from './main/customer/customer.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LayoutComponent } from './main/layout.component';
import { ProductComponent } from './main/product/product.component';
import { ProfileComponent } from './main/profile/profile.component';
import { AboutComponent } from './shared/components/about.component';
import { ErrorComponent } from './shared/components/error.component';
import { AuthGuard } from './shared/services/auth/auth-guard.service';


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
            path: 'customer',
            component: CustomerComponent,
            loadChildren: () => AppLayoutModule
          },
          {
            path: 'product',
            component: ProductComponent,
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
    ], { useHash: false })
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
