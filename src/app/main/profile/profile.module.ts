import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AuthModule } from 'src/app/shared/services/auth/auth.module';



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    SharedModule,
    AuthModule,
    CommonModule
  ]
})
export class ProfileModule { }
