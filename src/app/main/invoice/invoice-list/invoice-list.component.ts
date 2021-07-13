import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Customer } from './../../../core/classes/customer';
import { IInvoice } from './../../../core/classes/invoice';
import { Product } from './../../../core/classes/product';
import { CustomerService } from './../../../core/services/customer.service';
import { InvoiceService } from './../../../core/services/invoice.service';
import { ProductService } from './../../../core/services/product.service';
import { AlertType } from './../../../shared/components/alert/alert.model';
import { AlertService } from './../../../shared/components/alert/alert.service';
import { UtilsService } from './../../../shared/services/utils.service';
import { DamConstants } from './../../../shared/utils/constants';

declare var Stimulsoft: any;


@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  alert = { id: 'customer-list-alert', alertType: AlertType.ALINMA };
  loading: boolean;
  page = { id: 'customer-list', itemsPerPage: DamConstants.PAGE_SIZE, currentPage: 1, totalItems: 0 };

  constructor(private invoiceService: InvoiceService, private _fb: FormBuilder, private customerService: CustomerService, private productService: ProductService,
    private translateService: TranslateService, private alertService: AlertService, public utilService: UtilsService, private modalService: NgbModal) { }

  productList: Product[];
  invoiceList: any[];
  form: FormGroup;
  customerList: Customer[];
  productData: any;
  customerSelected: Number;
  showUpdatedMessage: boolean;
  color: string;
  msg: string;

  searchText: string = "";

  private allItems: any[];


  ngOnInit() {
    this.customerService.getAllCustomers().subscribe(data => {
      this.customerList = data;
    });

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
    this.invoiceService.getInvoices(this.utilService.getRequestParams(page, DamConstants.PAGE_SIZE, 'createdAt')).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(item => {
      console.log(item);
      this.invoiceList = item?.content;
      this.page.totalItems = item?.totalElements;
    });
  }

  updateForm(): void {
    this.form = this._fb.group({
      $key: '',
      customer: [null, Validators.required],
      totalPrice: 0,
      items: this._fb.array([])
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

  onDelete($key: string) {
    this.invoiceService.deleteInvoice($key);
    this.showUpdatedMessage = true;
    this.color = "danger"
    setTimeout(() => this.showUpdatedMessage = false, 3000);
    this.msg = "this record has been deleted"
  }

  onSubmitUpdate() {
    if (this.form.valid && this.form.controls['totalPrice'].value > 0) {
      const result: IInvoice = <IInvoice>this.form.value;
      this.invoiceService.updateInvoice(result);
      this.addMsg('success', '3000', 'this record has been updated');

    } else { alert("This record can not be updated with values 0. If you want to delete this record, go back to the list and do it") }
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

    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("assets/fonts/AlinmaTheSans-Bold.ttf");

    let report = new Stimulsoft.Report.StiReport();

    // Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("assets/fonts/AlinmaTheSans-Bold.ttf", "AlinmaTheSans-Bold");

    var fileContent = Stimulsoft.System.IO.File.getFile("assets/fonts/AlinmaTheSans-Bold.ttf", "AlinmaTheSans-Bold", true);
    var resource = new Stimulsoft.Report.Dictionary.StiResource(
      "AlinmaTheSans-Bold", "AlinmaTheSans-Bold", false, Stimulsoft.Report.Dictionary.StiResourceType.FontTtf, fileContent);
    report.dictionary.resources.add(resource);

    let dataSet = new Stimulsoft.System.Data.DataSet("Demo22");


    dataSet.readJson(this.utilService.generateInvoice(invoice));



    report.loadFile('https://res.cloudinary.com/genhub/raw/upload/v1626185587/DamPharmLat_Invoice_latest_4_bsmhex_nr2aee.mrt');

    report.regData("Demo22", "Demo22", dataSet);
    report.dictionary.synchronize();

    report.renderAsync(function () {
      // document.getElementById("savePdf").disabled = false;
    });

    this.saveReportPdf(report);
  }



  saveReportPdf(report) {
    var pdfSettings = new Stimulsoft.Report.Export.StiPdfExportSettings();
    var pdfService = new Stimulsoft.Report.Export.StiPdfExportService();
    var stream = new Stimulsoft.System.IO.MemoryStream();
    pdfSettings.EmbeddedFonts = true;
    pdfSettings.AllowImportSystemLibraries = true;
    // pdfSettings.UseUnicode = true;
    // pdfSettings.StandardPdfFonts = false;
    // pdfSettings.AllowFontsCache = true;

   
    // pdfService.LoadFontInfoToStore("AlinmaTheSans-Bold", "https://res.cloudinary.com/genhub/raw/upload/v1626176320/AlinmaTheSans-Bold_lpz4kh.ttf"); 




    var fileContent = Stimulsoft.System.IO.File.getFile("assets/fonts/AlinmaTheSans-Bold.ttf", "AlinmaTheSans-Bold", true);
    var resource = new Stimulsoft.Report.Dictionary.StiResource(
      "AlinmaTheSans-Bold", "AlinmaTheSans-Bold", false, Stimulsoft.Report.Dictionary.StiResourceType.FontTtf, fileContent);
    report.dictionary.resources.add(resource);

    report.renderAsync(function () {
      pdfService.exportToAsync(function () {
        var data = stream.toArray();
        var blob = new Blob([new Uint8Array(data)], { type: "application/pdf" });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          var fileName = (report.reportAlias == null || report.reportAlias.trim().length == 0) ? report.reportName : report.reportAlias;
          window.navigator.msSaveOrOpenBlob(blob, fileName + ".pdf");
        }
        else {
          var fileUrl = URL.createObjectURL(blob);
          window.open(fileUrl);
        }
      }, report, stream, pdfSettings);
    }, false);
  }

}
