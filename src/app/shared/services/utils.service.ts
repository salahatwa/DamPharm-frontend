import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment/min/locales.min';
// import { Headers, RequestOptions } from '@angular/common/http';
import { Subscription, Subject, Observable } from 'rxjs';
import { isUndefined } from 'lodash';
import { Title } from '@angular/platform-browser';
// import { ErrorMessage } from '../../core/classes/errorMessage';

declare var $: any;
//declare var Notyf: any;
//declare var numeral: any;

@Injectable()
export class UtilsService {
  //_notyf = new Notyf();
  _moment = moment;

  private changeLangDir= new Subject();
  public changeLangDir$: Observable<{}> = this.changeLangDir.asObservable();

  constructor(
    private translate: TranslateService,private titleService: Title
  ) { }

  /**
   * method to update document title
   * @param titleKey 
   * @param onLangChange 
   */
   setDocTitle(titleKey: string,onLangChange:boolean) {
     if(onLangChange)
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translate.get(titleKey).subscribe((text:string) => {
        this.titleService.setTitle(this.translate.instant(text));
      });
      });
      else
      this.translate.get(titleKey).subscribe(
        translation => {
          this.titleService.setTitle(translation);
        }); 
   }

  

  /**
    * Method to convert the file to base64
    */
  toBase64(file: File, cb: Function) {
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function (e: any) {
      const base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
      cb(base64Data);
    };
  }

  

  loading(options: object): void {
    const defaultOpts = {
      selector: 'app-inma-root',
      action: 'show',
      nice: false
    };

    const opts = Object.assign(defaultOpts, options);

    if (opts.nice) {
      return $(opts.selector).LoadingOverlay(opts.action, {
        image: '',
        color: 'rgba(28, 35, 54, 0.45)',
        custom: `<div class="container">
                  <i class="layer"></i>
                  <i class="layer"></i>
                  <i class="layer"></i>
                </div>`
      });
    }

    return $(opts.selector).LoadingOverlay(opts.action, {
      image: '',
      custom: `<div uk-spinner></div>`
    });
  }

  notyf(action: string, msg: string): void {
    switch (action) {
      case 'success':
     //   this._notyf.confirm(msg);
        break;
      case 'failed':
      //  this._notyf.alert(msg);
        break;

      default:
        break;
    }
  }

  showToast(response: any): void {
    if (response.code === 0) {
      this.notyf(
        'success',
        this.translate.instant('notification.success.delete')
      );
    } else {
      this.notyf(
        'failed', this.translate.instant('notification.customer.message.delete')
      );

    }
  }


  /**
 * auto reload defualt lan
 */
loadDefaultSetting()
{
  let lang:string = this.getCurrentLang();
  if(lang&&lang!=null&&lang!='')
  this.setLang(lang);
  else
  this.setLang('en');
}


  setLang(language: string): void {
    this.translate.use(language);
    this._moment.locale(language);
    localStorage.setItem('language', language);
    if(language==='ar')
      document.body.setAttribute("dir", "rtl");
    else
      document.body.setAttribute("dir", "ltr");
    this.changeLangDir.next(language);
  }

  setDir()
  {
    this.changeLangDir.next(this.getCurrentLang());
  }

  getCurrentLang(): string {
    return localStorage.getItem('language');
  }


 

  get format(): string {
    return localStorage.getItem('format');
  }

  get moment() {
    const lang = this.getCurrentLang();
    !lang
      ? this.setLang('en')
      : this.setLang(lang);
    return this._moment;
  }


  unsubscribeSub(sub: Subscription) {
    if (!isUndefined(sub)) {
      sub.unsubscribe();
    }
  }


  handleError(error: any): void {
    console.log('*****************ERROR*********************\n'+JSON.stringify(error)+"\n*****************************");
    if(!JSON.parse(error._body)&&JSON.parse(error._body).hasOwnProperty('errorDetails'))
    {
    //  var msg:ErrorMessage=JSON.parse(error._body);
     console.log("Error:#:"+error);
    //  this.notyf('failed',msg.message);
    }
  }
}
