import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertType } from 'src/app/shared/components/alert/alert.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Customer } from './../../../core/classes/customer';
import { CustomerService } from './../../../core/services/customer.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  loading: boolean = false;
  alert = { id: 'customer-opt-alert', alertType: AlertType.ALINMA };
  customerList: Customer[];
  constructor(public customerService: CustomerService, private translateService: TranslateService, private alertService: AlertService, public utilService: UtilsService, private modalService: NgbModal) { }



  ngOnInit() {
    this.customerService.getValueBtn(1);
    this.resetForm();
  }

  onSubmit(customerForm: NgForm) {
    this.loading = true
    if (customerForm.value.id == null)
      this.customerService.insertCustomer(customerForm.value).pipe(finalize(() => {
        this.loading = false;
      })).subscribe(data => {
        this.alertService.success(this.translateService.instant('notify.success.add'), this.alert);
      }, err => {
        this.alertService.error(err.message, this.alert);
      });

    else {
      let req: Customer = customerForm.value;
      req.index = this.customerService.selectedCustomer.index;
      this.customerService.updateCustomer(req).pipe(finalize(() => {
        this.loading = false;
      })).subscribe(data => {
        this.alertService.success(this.translateService.instant('notify.success.update'), this.alert);
      }, err => {
        this.alertService.error(err.message, this.alert);
      });
    }
    this.resetForm(customerForm);

  }

  resetForm(customerForm?: NgForm) {
    if (customerForm != null)
      customerForm.reset();
    this.customerService.getValueBtn(1);
    this.customerService.selectedCustomer = new Customer();

  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
