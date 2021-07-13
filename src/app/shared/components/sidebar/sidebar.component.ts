import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Config } from '../../classes/config';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../services/utils.service';
import { NgProgress, NgProgressRef } from 'ngx-progressbar';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/auth/user.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}


@Component({
  selector: 'app-inma-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ['./sidebar.component.css'],
  providers: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  isRTL: boolean;

  sidebar: boolean = true;
  menuItems: RouteInfo[];
  // private progressRef: NgProgressRef;
  constructor(private utilService: UtilsService, private userService: UserService, private progress: NgProgress) {
    // this.progressRef = this.progress.ref('myProgress');

  }

  async ngOnInit() {
    this.reloadDir();
    /**
     * title , readed from langulage by key 
     */
    this.menuItems = [
      { path: '/dashboard', title: 'sidebar.menu.dashboard', icon: 'dashboard', class: '' },
      { path: '/categories', title: 'sidebar.menu.categories', icon: 'production_quantity_limits', class: '' },
      { path: '/products', title: 'sidebar.menu.products', icon: 'production_quantity_limits', class: '' },
      { path: '/customers', title: 'sidebar.menu.customers', icon: 'people_outline', class: '' },
      { path: '/invoices', title: 'sidebar.menu.invoices', icon: 'people_outline', class: '' },
      { path: '/invoices-list', title: 'sidebar.menu.invoices', icon: 'people_outline', class: '' },

      { path: '/profile', title: 'sidebar.menu.profile', icon: 'person', class: '' },
      // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
      // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
      // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
      // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
      // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
      // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
    ];
  }

  updatePageTitle(key: string) {
    // this.progressRef.start();
    this.utilService.setDocTitle(key, false);
  }

  /**
   * auto reload direction on language change
   */
  reloadDir() {
    // setup listener to listen if language changed
    this.subscription = this.utilService.changeLangDir$.subscribe((data) => {
      console.log(data);
      if (data === 'ar')
        this.isRTL = true;
      else
        this.isRTL = false;
    });

    // check by defualt lang
    let lang: string = this.utilService.getCurrentLang();
    if (lang && lang != null && lang != '' && lang === 'ar')
      this.isRTL = true;
    else
      this.isRTL = false;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  logout() {
    this.userService.logout();
  }
}
