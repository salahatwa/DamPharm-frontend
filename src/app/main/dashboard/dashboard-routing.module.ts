import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './../../shared/services/auth/auth-guard.service';



@NgModule({
  imports: [
    // SharedModule,
    // AuthModule,
    // OrdersRoutingModule,
    // RouterModule.forChild([
    //   { path: 'dashboard', component: DashboardComponent }
    // ])
  ],
  // declarations: [DashboardComponent],
  providers: [
    AuthGuard,
    
  ],
  exports: [
    RouterModule,
    // DashboardComponent
  ]

})
export class DashboardRoutingModule { }
