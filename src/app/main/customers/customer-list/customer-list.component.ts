import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertType } from 'src/app/shared/components/alert/alert.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { DamConstants } from 'src/app/shared/utils/constants';
import { Customer } from './../../../core/classes/customer';
import { CustomerService } from './../../../core/services/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customerList: Customer[];

  alert = { id: 'customer-list-alert', alertType: AlertType.ALINMA };
  subscription: Subscription;
  loading: boolean;
  page = { id: 'customer-list', itemsPerPage: DamConstants.PAGE_SIZE, currentPage: 1, totalItems: 0 };

  constructor(public customerService: CustomerService, private translateService: TranslateService, private alertService: AlertService, public utilService: UtilsService, private modalService: NgbModal) { }


  ngOnInit() {
    this.subscription = this.customerService.currentMessage.subscribe(customer => {
      if (this.customerList && customer?.action == 'Add')
        this.customerList.unshift(customer);
      else if (this.customerList && customer?.action == 'Update') {
        console.log(customer);
        this.customerList[customer.index] = customer;
      }
    });
    this.getPage(1);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPage(page: number) {
    this.loading = true;
    this.page.currentPage = page;
    this.customerService.getCustomers(this.utilService.getRequestParams(page, DamConstants.PAGE_SIZE, 'createdAt')).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(item => {
      this.customerList = item?.content;
      this.page.totalItems = item?.totalElements;
    });
  }

  onEdit(customer: Customer, index: number) {
    this.customerService.getValueBtn(2);
    this.customerService.selectedCustomer = Object.assign({}, customer);
    this.customerService.selectedCustomer.index = index;
  }

  onDelete(customer: Customer, index: number) {

    const dialogRef = this.modalService.open(ConfirmDialogComponent);

    dialogRef.result.then(result => {
      if (result) {
        this.loading = true;
        this.customerService.deleteCustomer(customer).pipe(finalize(() => {
          this.loading = false;
        })).subscribe(data => {
          this.customerList.splice(index, 1);
          this.alertService.success(this.translateService.instant('notify.success.delete'), this.alert);
          console.log(this.translateService.instant('notify.success.delete'));
        }, err => {
          this.alertService.success(err.message, this.alert);
        });

      }
    }).catch((res) => {

    });


  }
}
