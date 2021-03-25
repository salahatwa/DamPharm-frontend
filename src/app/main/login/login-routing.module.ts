import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/modules/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent,data: {title: 'form.button.login'}}
    ])
  ],
  declarations: [LoginComponent],
  providers: [],
  exports: [
    RouterModule,
    LoginComponent
  ]
})
export class LoginRoutingModule { }
