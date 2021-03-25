import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { NoAuthGuard } from './no-auth-guard.service';
import { AuthRoutingModule } from './auth-routing.module';
import { ShowAuthedDirective } from './show-authed.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './http.token.interceptor';
import { ListErrorsComponent } from './error-component/list-errors.component';
import { AuthGuard } from './auth-guard.service';
import { MatrialModule } from '../../modules/matrial.module';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatrialModule
  ],
  declarations: [
    AuthComponent,
    ShowAuthedDirective,
    ListErrorsComponent
  ],
  exports:[
    AuthComponent,
    ShowAuthedDirective,
    ListErrorsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    NoAuthGuard,
    AuthGuard,
    UserService,
    JwtService
  ]
})
export class AuthModule {}
