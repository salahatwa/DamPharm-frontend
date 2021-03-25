import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { SharedModule } from '../../modules/shared.module';
import { MatrialModule } from '../../modules/matrial.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    MatrialModule,
    TranslateModule
    // SharedModule
  ],
  exports:[NavbarComponent]
})
export class NavbarModule { }
