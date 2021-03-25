import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { CustomPaginationService } from './services/custom-pagination.service';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatrialModule } from '../../modules/matrial.module';

@NgModule({
  declarations: [CustomPaginationComponent],
  imports: [
    MatrialModule,
    CommonModule,
    // BrowserModule,
    RouterModule
  ],
  exports:[
    CustomPaginationComponent
  ],
  providers:[
    CustomPaginationService
  ]
})
export class PaginationModule { }
