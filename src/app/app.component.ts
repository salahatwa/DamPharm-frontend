import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Config } from './shared/classes/config';
import { UtilsService } from './shared/services/utils.service';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from './shared/services/auth/user.service';

declare const Offline: any;
declare const jQuery: any;
declare const UIkit: any;
declare const ipcRenderer: any;

@Component({
  selector: 'app-dampharm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private subscription: Subscription;
  public spinnerPos:string='left';
  public progressDir:string='ltr+';

  constructor( router: Router,
    private utilService: UtilsService,
    private http: HttpClient,
    private utils: UtilsService,
    private userService:UserService
  ) {
  
    this.utils.loadDefaultSetting();
    this.reloadDir();
    this.userService.populate();

    router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        var title = this.getTitle(router.routerState, router.routerState.root).join('-');
        this.utilService.setDocTitle(title,true);
      }
    });
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
      {
      this.spinnerPos='left';
      this.progressDir='ltr+';
      }
      else
      {
      this.spinnerPos='right';
      this.progressDir='rtl+';
      }
     });

     // check by defualt lang
     let lang:string = this.utilService.getCurrentLang();
       if(lang&&lang!=null&&lang!=''&&lang==='ar')
       {
        this.spinnerPos='left';
        this.progressDir='ltr+';
        }
       else
       {
        this.spinnerPos='right';
        this.progressDir='rtl+';
        }
  }



  // collect that title data properties from all child routes
  // there might be a better way but this worked for me
  getTitle(state, parent) {
    var data = [];
    if(parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if(state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnInit() {  
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
