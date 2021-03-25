import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsService } from '../services/utils.service';
import { MatrialModule } from './matrial.module';
import { ApiService } from '../services/api.service';
import { NavbarModule } from '../components/navbar/navbar.module';
import { SidebarModule } from '../components/sidebar/sidebar.module';
import { Title } from '@angular/platform-browser';
import { NgProgress, NgProgressRef } from 'ngx-progressbar';
import { AlertModule } from '../components/alert/alert.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatrialModule,
    NavbarModule,
    SidebarModule,
    AlertModule
  ],
  declarations: [
    
  ],
  providers: [Title,UtilsService,ApiService],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    NavbarModule,
    TranslateModule,
    MatrialModule,
    AlertModule
  ]
})
export class SharedModule { }
