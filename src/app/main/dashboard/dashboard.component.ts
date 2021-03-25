import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';

import 'moment/min/locales.min';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-inma-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  
constructor(private utilService:UtilsService)
{
  this.utilService.setDocTitle('dashboard.title',true);
}
  

  ngOnInit() {
    
  }

  ngOnDestroy() {
  
  }

  ngAfterViewInit() {
  }

 

}
