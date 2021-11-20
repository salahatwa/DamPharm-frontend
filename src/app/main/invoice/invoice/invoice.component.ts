import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Customer } from './../../../core/classes/customer';
import { IInvoice, ServiceType } from './../../../core/classes/invoice';
import { Product } from './../../../core/classes/product';
import { CustomerService } from './../../../core/services/customer.service';
import { InvoiceService } from './../../../core/services/invoice.service';
import { ProductService } from './../../../core/services/product.service';



@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  public ServiceType = ServiceType;
  form: FormGroup;
  selectedCustomer: Customer;
  showDiv: true;
  customer: true;
  customerList: Customer[];
  productList: Product[];
  loading: boolean = false;

  constructor(private _fb: FormBuilder, private invoiceService: InvoiceService, private customerService: CustomerService, private productService: ProductService) { }

  ngOnInit() {
    this.loading = true;
    this.customerService.getAllCustomers().pipe(finalize(() => {
      this.loading = false;
    })).subscribe(data => {
      this.customerList = data;
    });
    this.productService.getAllProducts().pipe(finalize(() => {
      this.loading = false;
    })).subscribe(data => {
      this.productList = data;
    });
    this.initForm();
  }

  initForm(): void {
    this.form = this._fb.group({
      customer: ["", Validators.required],
      type: [ServiceType.INVOICE, Validators.required],
      totalPrice: 0,
      items: this._fb.array([])
    });

    // initialize stream
    const myFormValueChanges$ = this.form.controls['items'].valueChanges;
    // subscribe to the stream
    myFormValueChanges$.subscribe(items => this.updatePurchasesAmount(items));
  }

  isSample() {
    return this.form.get('type').value === ServiceType.SAMPLE;
  }

  updateProductList(product) {
    let itemIndex = this.productList.findIndex(item => item.id == product.id);
    this.productList[itemIndex] = product;
  }



  updatePurchasesAmount(items: any) {
    const control = <FormArray>this.form.controls['items'];
    let totalSum = 0;
    for (let i in items) {
      let amount = (items[i].quantity * items[i].product.price);

      let discoubtControlValue = control.at(+i).get('discount').value;


      if (discoubtControlValue) {
        let discount = amount - ((amount * discoubtControlValue) / 100);
        amount = discount;
      }
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
      quantity: [1, [Validators.max(product.availableQuantity), Validators.required, Validators.pattern(numberPatern)]],
      discount: [0, [Validators.max(99), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      bonus: [0, [Validators.max(product.availableQuantity), Validators.pattern(numberPatern)]],
      amount: [{ value: 0, disabled: true }],
    });
  }

  money(value: number) {
    return this.invoiceService.money(value);
  }

  public addPurchase(product: Product): void {
    const control = <FormArray>this.form.controls['items'];
    let add = true;
    for (let i in control.controls) {
      if (control.at(+i).get('product').value.id === product.id) {
        control.at(+i).get('quantity').setValue(control.at(+i).get('quantity').value + 1);
        add = false;
      }
    }
    if (add) {
      control.push(this.purchaseForm(product));
      this.showDiv = add;
    }
  }

  removePurchase(i: number): void {
    const control = <FormArray>this.form.controls['items'];
    control.removeAt(i);
  }

  resetPurchase(): void {
    this.form.controls['totalPrice'].setValue(0);
    const control = <FormArray>this.form.controls['items'];
    control.controls = [];
  }

  updateAvailableQuantity(invoice: IInvoice) {
    invoice.items.forEach(item => {
      item.product.availableQuantity = item.product.availableQuantity - item.quantity - item.bonus;
    });
  }

  saveProduct() {

    if (this.form.valid && (this.form.controls['totalPrice'].value > 0)) {
      this.loading = true;
      const result: IInvoice = <IInvoice>this.form.value;
      // Do useful stuff with the gathered data

      if (this.isSample()) {
        result.totalPrice = 0;
      }

      this.updateAvailableQuantity(result);

      this.invoiceService.insertInvoice(result).pipe(finalize(() => {
        this.loading = false;
      })).subscribe((data => {
        this.invoiceService.openInvoiceDialog(data);
        this.selectedCustomer = null;
        this.showDiv = null;
        //Agregar msg
        this.initForm();
        // this.router.navigate(['/invoices-list']);
      }));

    } else {
      if (this.form.controls['totalPrice'].value <= 0) {
        //Agregar msg
      }
      else //Agregar msg
        (console.log('mesg'))
    }
  }






  getSelectedOptionText(event) {
    this.resetPurchase();
    this.showDiv = null;
    this.selectedCustomer = event;
  }

}
