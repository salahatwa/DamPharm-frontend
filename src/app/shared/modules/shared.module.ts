import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertModule } from '../components/alert/alert.module';
import { NavbarModule } from '../components/navbar/navbar.module';
import { SidebarModule } from '../components/sidebar/sidebar.module';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { ConfirmDialogComponent } from './../components/confirm-dialog/confirm-dialog.component';
import { SectionLoadingComponent } from './../components/loading/section-loading.component';
import { NoResultFound } from './../components/no-result-found.component';
import { ReportViewerDialogComponent } from './../components/report-dialogs/report-viewer-dialog/report-viewer.component';
import { MatrialModule } from './matrial.module';


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
    AlertModule,
    NgxPaginationModule,
    NgbModalModule,
  ],
  declarations: [
    SectionLoadingComponent, ConfirmDialogComponent, ReportViewerDialogComponent, NoResultFound
  ],
  providers: [Title, UtilsService, ApiService],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    NavbarModule,
    TranslateModule,
    MatrialModule,
    AlertModule,
    NgxPaginationModule,
    SectionLoadingComponent,
    NgbModalModule,
    ConfirmDialogComponent,
    ReportViewerDialogComponent,
    NoResultFound
  ]
})
export class SharedModule { }
