import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';
import { Subscription } from 'rxjs';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit , OnDestroy {

  private subscription: Subscription;
  isRTL:boolean;
  constructor(private utilService:UtilsService) { }

  ngOnInit(): void {

    
   this.reloadDir();
   
  }

  /**
   * auto reload direction on language change
   */
  reloadDir()
  {
    // setup listener to listen if language changed
    this.subscription = this.utilService.changeLangDir$.subscribe((data) =>  {
      console.log(data);
      if(data==='ar')
      this.isRTL=true;
      else
      this.isRTL=false;
     });

     // check by defualt lang
     let lang:string = this.utilService.getCurrentLang();
       if(lang&&lang!=null&&lang!=''&&lang==='ar')
         this.isRTL=true;
       else
         this.isRTL=false;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

 

}
