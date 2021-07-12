import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportViewerDialogComponent } from 'src/app/shared/components/report-dialogs/report-viewer-dialog/report-viewer.component';
import { Customer } from './../../../core/classes/customer';
import { IInvoice } from './../../../core/classes/invoice';
import { Product } from './../../../core/classes/product';
import { CustomerService } from './../../../core/services/customer.service';
import { InvoiceService } from './../../../core/services/invoice.service';
import { ProductService } from './../../../core/services/product.service';
declare var Stimulsoft: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  form: FormGroup;
  phoneCustomer: "";
  addressCustomer: "";
  showDiv: true;
  customer: true;
  title = 'Add Invoice';
  private selectUndefinedOptionValue: any;
  customerList: Customer[];
  productList: Product[];
  showDialog1;
  showDialog;

  constructor(private modalService: NgbModal, private router: Router, private _fb: FormBuilder, private invoiceService: InvoiceService, private customerService: CustomerService, private productService: ProductService) { }

  ngOnInit() {
    this.customerService.getAllCustomers().subscribe(data => {
      this.customerList = data;
    });
    this.productService.getAllProducts().subscribe(data => {
      this.productList = data;
    });
    this.initForm();
  }

  initForm(): void {
    this.form = this._fb.group({
      customer: ["", Validators.required],
      totalPrice: 0,
      items: this._fb.array([])
    });
    // initialize stream
    const myFormValueChanges$ = this.form.controls['items'].valueChanges;
    // subscribe to the stream
    myFormValueChanges$.subscribe(items => this.updatePurchasesAmount(items));
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
  }

  purchaseForm(product?: Product): FormGroup {
    const numberPatern = '^[0-9.,]+$';
    return this._fb.group({
      product: [product, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(numberPatern)]],
      amount: [{ value: 0, disabled: true }],
    });
  }

  money(value: number) {
    let tmoney = this.invoiceService.money(value);
    return tmoney;
  }

  public addPurchase(product: Product): void {
    const control = <FormArray>this.form.controls['items'];
    let add = true;
    for (let i in control.controls) {
      if (control.at(+i).get('product').value.name === product.name) {
        // control.controls[i].get('quantity').setValue(control.controls[i].controls.quantity.value + 1);
        control.at(+i).get('quantity').setValue(control.at(+i).get('quantity').value + 1);
        add = false;
      }
    }
    if (add) {
      control.push(this.purchaseForm(product));
      this.showDiv = add;
    }
  }

  private removePurchase(i: number): void {
    const control = <FormArray>this.form.controls['items'];
    control.removeAt(i);
  }

  resetPurchase(): void {
    this.form.controls['totalPrice'].setValue(0);
    const control = <FormArray>this.form.controls['items'];
    control.controls = [];
  }

  saveProduct() {
    if (this.form.valid && this.form.controls['totalPrice'].value > 0) {
      const result: IInvoice = <IInvoice>this.form.value;
      // Do useful stuff with the gathered data
      console.log(result);
      this.invoiceService.insertInvoice(result).subscribe((data => {

        this.phoneCustomer = '';
        this.addressCustomer = '';
        this.showDiv = null;
        //Agregar msg
        this.initForm();
        this.router.navigate(['/invoices-list']);
      }));


    } else {
      if (this.form.controls['totalPrice'].value <= 0) {
        //Agregar msg
      }
      else //Agregar msg
        (console.log('mesg'))
    }
  }


 print() {

    let report = new Stimulsoft.Report.StiReport();

    let dataSet = new Stimulsoft.System.Data.DataSet("Demo22");

    // this.dataSet.readJson(this.invoice());

    report.loadFile('https://res.cloudinary.com/genhub/raw/upload/v1617538367/DamPharmLat10_zzcvtn.mrt');

    report.regData("Demo22", "Demo22", dataSet);
    report.dictionary.synchronize();

    report.renderAsync(function () {
      // document.getElementById("savePdf").disabled = false;
    });

    this.saveReportPdf(report);


    // const dialogRef = this.modalService.open(ReportViewerDialogComponent, { size: 'xl' });

    // dialogRef.result.then(result => {

    //   if (result) {


    //   }
    // }).catch((res) => {

    // });
  }


  saveReportPdf(report) {
    var pdfSettings = new Stimulsoft.Report.Export.StiPdfExportSettings();
    var pdfService = new Stimulsoft.Report.Export.StiPdfExportService();
    var stream = new Stimulsoft.System.IO.MemoryStream();
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

  getSelectedOptionText(event) {
    this.resetPurchase();
    this.showDiv = null;
    this.phoneCustomer = event.phone;
    this.addressCustomer = event.address;
  } 



}
