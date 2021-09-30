import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PaidDialogComponent } from '../update-status/paid-dialog/paid-dialog.component';
import { Customer } from './../../../core/classes/customer';
import { IInvoice, InvoiceStatusUpdate, InvoiceStatus } from './../../../core/classes/invoice';
import { Product } from './../../../core/classes/product';
import { CustomerService } from './../../../core/services/customer.service';
import { InvoiceService } from './../../../core/services/invoice.service';
import { ProductService } from './../../../core/services/product.service';
import { AlertType } from './../../../shared/components/alert/alert.model';
import { AlertService } from './../../../shared/components/alert/alert.service';
import { UtilsService } from './../../../shared/services/utils.service';
import { DamConstants } from './../../../shared/utils/constants';
import { ReturnsDialogComponent } from '../update-status/returns-dialog/returns-dialog.component';



export enum SearchMode {
  INVOICE_LIST = 0, INVOICE_FILTER = 1
}

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  newInvoiceStatus: InvoiceStatus;
  // statusTypes: InvoiceStatus;
  public statusTypes = [{ key: 'NEW', value: 'جديد', class: 'build-badge__status-indeterminate' }, { key: 'PAID', value: 'مدفوعة', class: 'build-badge__status-success' }, { key: 'RETURNS', value: 'مرتجع', class: 'build-badge__status-warning' }, { key: 'CANCELED', value: 'ألغيت', class: 'build-badge__status-error' }, { key: 'PAID_PARTIALLY', value: 'مدفوعة جزئيا', class: 'build-badge__status-information' }]


  getAvailableStatus(status) {
    let desiredStatus: any[] = [];
    switch (status) {
      case 'NEW':
        desiredStatus = this.filterWithMultipleProperties(this.statusTypes, ['PAID', 'RETURNS', 'PAID_PARTIALLY', 'CANCELED']);
        break;
      case 'RETURNS':
        desiredStatus = this.filterWithMultipleProperties(this.statusTypes, ['PAID', 'RETURNS', 'PAID_PARTIALLY']);
        break;
      case 'PAID_PARTIALLY':
        desiredStatus = this.filterWithMultipleProperties(this.statusTypes, ['PAID', 'PAID_PARTIALLY']);
        break;


      default:
        desiredStatus = this.statusTypes;
        break;
    }

    return desiredStatus;
  }

  /**
   * filter Arr with multiple elements
   * @param arr 
   * @param codes 
   * @returns 
   */
  filterWithMultipleProperties(arr, keys: string[]): any[] {
    let result = arr.filter(item => keys.includes(item.key));
    return result;
  }




  mode: SearchMode = SearchMode.INVOICE_LIST;
  alert = { id: 'customer-list-alert', alertType: AlertType.ALINMA };
  loading: boolean;
  page = { id: 'customer-list', itemsPerPage: DamConstants.PAGE_SIZE, currentPage: 1, totalItems: 0 };


  constructor(public datepipe: DatePipe, private invoiceService: InvoiceService, private _fb: FormBuilder, private customerService: CustomerService, private productService: ProductService,
    private translateService: TranslateService, private alertService: AlertService, public utilService: UtilsService, private modalService: NgbModal) { }

  productList: Product[];
  invoiceList: any[];
  form: FormGroup;
  searchForm: FormGroup;
  customerList: Customer[];
  productData: any;
  customerSelected: Number;
  showUpdatedMessage: boolean;
  color: string;
  msg: string;

  searchText: string = "";



  ngOnInit() {
    this.customerService.getAllCustomers().subscribe(data => {
      this.customerList = data;
    });

    this.mode = SearchMode.INVOICE_LIST;
    this.getPage(1);

    this.productService.getAllProducts().subscribe(data => {
      this.productList = data;
    });
    this.updateForm();
    // initialize stream
    const myFormValueChanges$ = this.form.controls['items'].valueChanges;
    // subscribe to the stream
    myFormValueChanges$.subscribe(items => this.updatePurchasesAmount(items));
  }

  getPage(page: number) {
    this.loading = true;
    this.page.currentPage = page;
    switch (this.mode) {
      case SearchMode.INVOICE_FILTER:
        this.filter(page);
        break;

      case SearchMode.INVOICE_LIST:
        this.invoiceService.getInvoices(this.utilService.getRequestParams(page, DamConstants.PAGE_SIZE, 'createdAt')).pipe(finalize(() => {
          this.loading = false;
        })).subscribe(item => {
          console.log(item);
          this.invoiceList = item?.content;
          this.page.totalItems = item?.totalElements;
        });
        break;
      default:
        break;
    }

  }

  updateForm(): void {
    // let date=new Date();
    this.form = this._fb.group({
      $key: '',
      customer: [null, Validators.required],
      totalPrice: 0,
      items: this._fb.array([])
    });

    this.initSearchForm();
  }

  // currentDate = new Date();

  initSearchForm() {
    // dd/MM/yyyy
    let currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.searchForm = this._fb.group({
      id: '',
      customer: [null],
      statusList: [null],
      state: '',
      fromDate: new FormControl(new Date(currentDate)),
      toDate: new FormControl(new Date(currentDate))
    });
  }

  public resetPurchase(): void {
    this.form.controls['totalPrice'].setValue(0);
    const control = <FormArray>this.form.controls['items'];
    control.controls = [];
  }

  public removePurchase(i: number): void {
    const control = <FormArray>this.form.controls['items'];
    control.removeAt(i);
  }

  updatePurchasesAmount(items: any) {
    const control = <FormArray>this.form.controls['items'];
    let totalSum = 0;
    for (let i in items) {
      const amount = (items[i].quantity * items[i].product.price);
      control.at(+i).get('amount').setValue(amount, { onlySelf: true, emitEvent: false });
      // update total price
      totalSum += amount;
    }
    this.form.get('totalPrice').setValue(totalSum);
    if (totalSum <= 0) { alert("the total can't be 0") }
  }

  purchaseForm(product?: Product): FormGroup {
    const numberPatern = '^[0-9.,]+$';
    return this._fb.group({
      product: [product, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(numberPatern)]],
      amount: [{ value: 0, disabled: true }],
    }
    );
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  onUpdate(invoice) {
    const control = <FormArray>this.form.controls['items'];
    control.controls = [];
    this.form.controls['$key'].setValue(invoice.$key);
    this.form.controls['customer'].setValue(invoice.customer);
    for (let i in invoice.items) {
      const product = (invoice.items[i].product);
      const quantity = (invoice.items[i].quantity);
      this.addPurchase(product);
      control.at(+i).get('quantity').setValue(quantity);
    }
  }


  onDelete(invoice: IInvoice, index: number) {

    const dialogRef = this.modalService.open(ConfirmDialogComponent);

    dialogRef.result.then(result => {
      if (result) {
        this.loading = true;
        this.invoiceService.deleteInvoice(invoice?.id).pipe(finalize(() => {
          this.loading = false;
        })).subscribe(data => {
          this.invoiceList.splice(index, 1);
          this.alertService.success(this.translateService.instant('notify.success.delete'), this.alert);
        }, err => {
          this.alertService.error(err.message, this.alert);
        });

      }
    }).catch((res) => {

    });
  }

  updateStatus(status, invoice: IInvoice, index: number) {
    let rq: InvoiceStatusUpdate = {
      status: status,
      id: invoice?.id
    };

    switch (status) {
      case 'PAID':
        const dialogRef = this.modalService.open(PaidDialogComponent);
        invoice.totalyPaid = true;
        dialogRef.componentInstance.invoice = invoice;

        dialogRef.result.then(result => {
          if (result) {
            rq.paidDate = result?.paidDate;
            this.updateInvoiceStatus(rq, index);
          }
        }).catch((res) => {

        });

        break;

      case 'CANCELED':
        const cdialogRef = this.modalService.open(ConfirmDialogComponent);

        cdialogRef.result.then(result => {
          if (result) {
            rq.cancel = result;
            this.updateInvoiceStatus(rq, index);

          }
        }).catch((res) => {

        });
        break;

      case 'RETURNS':
        const cdialogRef2 = this.modalService.open(ReturnsDialogComponent);
        cdialogRef2.componentInstance.invoice = invoice;
        cdialogRef2.result.then(result => {
          if (result) {
            console.log(result);
            rq.items = result?.items;
            rq.returnsDate = result?.returnsDate;
            rq.id = result?.id;
            this.updateInvoiceStatus(rq, index);

          }
        }).catch((res) => {

        });
        break;

      case 'PAID_PARTIALLY':
        const dialogRef3 = this.modalService.open(PaidDialogComponent);
        invoice.totalyPaid = false;
        dialogRef3.componentInstance.invoice = invoice;

        dialogRef3.result.then(result => {
          if (result) {
            rq.paidDate = result?.paidDate;
            rq.paidAmt = result?.paidAmt;
            this.updateInvoiceStatus(rq, index);
          }
        }).catch((res) => {

        });

        break;
        break;

      default:
        // this.updateInvoiceStatus(rq);
        break;
    }

  }

  updateInvoiceStatus(rq: InvoiceStatusUpdate, index: number) {
    this.loading = true;
    this.invoiceService.updateInvoiceStatus(rq).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(data => {
      this.invoiceList[index] = data;
      this.alertService.success(this.translateService.instant('notify.success.update'), this.alert);
    }, err => {
      this.alertService.error(err.message, this.alert);
    });
  }

  onSubmitUpdate() {
    if (this.form.valid && this.form.controls['totalPrice'].value > 0) {
      const result: IInvoice = <IInvoice>this.form.value;
      this.invoiceService.updateInvoice(result);
      this.addMsg('success', '3000', 'this record has been updated');

    } else { alert("This record can not be updated with values 0. If you want to delete this record, go back to the list and do it") }
  }

  filter(page: number) {
    this.mode = SearchMode.INVOICE_FILTER;
    let filter = this.searchForm.value;
    console.log(filter);
    this.loading = true;
    this.page.currentPage = page;
    this.invoiceService.filterInvoices(filter, this.utilService.getRequestParams(page, DamConstants.PAGE_SIZE, 'createdAt')).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(item => {
      console.log(item);
      this.invoiceList = item?.content;
      this.page.totalItems = item?.totalElements;
    });
  }

  downloadStatmentReport() {

    let filter = this.searchForm.value;
    this.loading = true;
    this.invoiceService.downloadStatment(filter).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(data => {
      this.downLoadFile(data, "application/pdf");
    }, err => {

    });

  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url); if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
  resetSearchForm() {
    this.mode = SearchMode.INVOICE_LIST;
    this.searchForm.reset();
    this.getPage(1);
  }

  public addPurchase(product: Product): void {
    const control = <FormArray>this.form.controls['items'];
    let add = true;
    for (let i in control.controls) {
      if (control.at(+i).get('product').value.name === product.name) {
        control.at(+i).get('quantity').setValue(control.at(+i).get('quantity').value + 1);
        add = false;
      }
    }
    if (add) {
      control.push(this.purchaseForm(product));
    }
  }

  public addMsg(color, timeout, msg) {
    this.showUpdatedMessage = true;
    this.color = color;
    this.msg = msg;
    setTimeout(() => this.showUpdatedMessage = false, timeout);

  }

  money(value: number) {
    let tmoney = this.invoiceService.money(value);
    return tmoney;
  }

  filterCondition(invoice) {
    return invoice?.customer?.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1 || invoice?.customer?.lastname.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
  }


  print(invoice) {
    this.invoiceService.openInvoiceDialog(invoice);
  }

}
