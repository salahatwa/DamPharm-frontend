import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslationModule } from '../../modules/translation.module';
import { AlertComponent } from './alert.component';




@NgModule({
  declarations: [AlertComponent],
  imports: [
    CommonModule,
    TranslationModule
  ],
  exports: [
    AlertComponent
  ]
})
export class AlertModule { }
