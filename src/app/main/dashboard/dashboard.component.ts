import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';

import 'moment/min/locales.min';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AnalyisService } from './../../core/services/analyis.service'
import { Analyis } from 'src/app/core/classes/analyis';
import { AlertType } from 'src/app/shared/components/alert/alert.model';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/auth/user.service';
import { User } from 'src/app/core/classes/user.model';
import { Product } from 'src/app/core/classes/product';

@Component({
  selector: 'app-inma-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  alert = { id: 'analyis-alert', alertType: AlertType.ALINMA };
  loading: boolean;

  analyis: Analyis;
  currentUser: User;

  constructor(private utilService: UtilsService, private userService:UserService,private analyisService: AnalyisService) {
    this.utilService.setDocTitle('dashboard.title', true);
  }


  ngOnInit() {
    this.loading = true;
    this.userService.currentUser.subscribe((data) => {
      this.currentUser = data;
    });

    this.analyisService.getCounts().pipe(finalize(() => {
      this.loading = false;
    })).subscribe((data) => {
      console.log(data);
      this.analyis = data
    });

  }


  ngOnDestroy() {

  }

  ngAfterViewInit() {
  }



}
