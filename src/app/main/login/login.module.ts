import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './../../shared/services/auth/auth.module';

@NgModule({
  imports: [
    SharedModule,
    HttpClientModule,
    LoginRoutingModule
  ],
  providers: []
})
export class LoginModule { }
