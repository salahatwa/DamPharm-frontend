import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { isUndefined } from 'lodash';
import * as moment from 'moment';
import 'moment/min/locales.min';
import { PrintInvoice, BillFrom, BillTo, BillDetail, BillTotal } from './../../core/classes/print-invoice';
// import { Headers, RequestOptions } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { IInvoice } from 'src/app/core/classes/invoice';
// import { ErrorMessage } from '../../core/classes/errorMessage';

declare var $: any;
//declare var Notyf: any;
//declare var numeral: any;

@Injectable()
export class UtilsService {
  //_notyf = new Notyf();
  _moment = moment;

  private changeLangDir = new Subject();
  public changeLangDir$: Observable<{}> = this.changeLangDir.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document,
    private translate: TranslateService, private titleService: Title
  ) { }

  /**
   * method to update document title
   * @param titleKey 
   * @param onLangChange 
   */
  setDocTitle(titleKey: string, onLangChange: boolean) {
    if (onLangChange)
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translate.get(titleKey).subscribe((text: string) => {
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
  loadDefaultSetting() {
    let lang: string = this.getCurrentLang();
    if (lang && lang != null && lang != '')
      this.setLang(lang);
    else
      this.setLang('ar');
  }

  getRequestParams(page, pageSize, sortBy): any {
    let params = {};

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    if (sortBy) {
      params[`sortBy`] = sortBy;
    }

    return params;
  }

  setLang(language: string): string {
    this.translate.use(language);
    this._moment.locale(language);
    localStorage.setItem('language', language);
    if (language === 'ar')
      this.document.body.setAttribute("dir", "rtl");
    else
      this.document.body.setAttribute("dir", "ltr");
    this.changeLangDir.next(language);
    return language;
  }

  setDir() {
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
    console.log('*****************ERROR*********************\n' + JSON.stringify(error) + "\n*****************************");
    if (!JSON.parse(error._body) && JSON.parse(error._body).hasOwnProperty('errorDetails')) {
      //  var msg:ErrorMessage=JSON.parse(error._body);
      console.log("Error:#:" + error);
      //  this.notyf('failed',msg.message);
    }
  }

  /**
  * This Method for init PrintInvoice data
  */
  generateInvoice(invoice:IInvoice): PrintInvoice {
    var printInvoice = new PrintInvoice();
    var billFrom: BillFrom = new BillFrom();
    billFrom.name = "DamPharm";
    billFrom.email = "services@dampharm.com";
    billFrom.company = "DamPharm";
    billFrom.city = "Monfia";
    billFrom.phone = "966549168065";
    billFrom.website = "dampharm.com";
    billFrom.state = "Egypt";
    billFrom.address = "Elbajour-Monfia";


    var billTo: BillTo = new BillTo();
    billTo.name = invoice.customer.name;
    billTo.company = invoice.customer.id;
    billTo.phone = invoice.customer.phone;
    billTo.state = invoice.customer.address;
    billTo.address = invoice.customer.address;
    billTo.city = invoice.customer.address;

    let totalSum = 0;


    invoice.items.forEach((item, i) => {

      var billDetail = new BillDetail();
      billDetail.billNum = (i + 1);
      billDetail.productName = item.product.name;
      billDetail.productQty = item.quantity + '';
      billDetail.productUnitPrice = item.product.price + '';
      billDetail.productAmount =(item.quantity*item.product.price);
      // billDetail.productDiscount = item.discount + '%';
      // billDetail.productAmountAfterDiscount = this.currency.set(((100 - item.discount) * item.product.selling_price * item.amount) / 100).format(this.format()) + '';
      printInvoice.billProduct.push(billDetail);

      // totalSum = totalSum + (((100 - item.discount) * item.product.selling_price * item.amount) / 100);
      totalSum = totalSum + billDetail.productAmount;

    });



    var billTotal = new BillTotal();
    billTotal.subtotal = totalSum + '';
    billTotal.total = totalSum + '';
    // billTotal.createdAt = this.datepipe.transform(this.getCurrentDate(), 'yyyy-MM-dd');
    billTotal.billNum =invoice.invoiceNumber;
    billTotal.other = '';
    billTotal.description = 'If you have any questions about this invoice, please contact';
    billTotal.commentTitle = 'OTHER COMMENTS';
    billTotal.comment1 = '1. Total payment due in 30 days';
    billTotal.comment2 = '2. Please include the invoice number on your check';

    printInvoice.billTotal = billTotal;
    printInvoice.billTo = billTo;
    printInvoice.billFrom = billFrom;
    return printInvoice;
  }

}
