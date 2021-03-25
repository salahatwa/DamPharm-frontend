import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AuthModule } from 'src/app/shared/services/auth/auth.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    AuthModule,
    DashboardRoutingModule
  ],
  providers: []
})
export class DashboardModule { }
