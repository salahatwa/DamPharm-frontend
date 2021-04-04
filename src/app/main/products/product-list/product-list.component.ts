import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertType } from 'src/app/shared/components/alert/alert.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { DamConstants } from 'src/app/shared/utils/constants';
import { ProductService } from '../../../core/services/product.service';
import { Product } from './../../../core/classes/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit, OnDestroy {

  alert = { id: 'product-list-alert', alertType: AlertType.ALINMA };
  subscription: Subscription;
  loading: boolean;
  page = { id: 'product-list', itemsPerPage: DamConstants.PAGE_SIZE, currentPage: 1, totalItems: 0 };

  productList: Product[];
  constructor(private translateService: TranslateService, private alertService: AlertService, public productService: ProductService, public utilService: UtilsService, private modalService: NgbModal) { }

  showMessage: boolean;
  colormsg: string;
  msg: string;

  ngOnInit() {
    this.subscription = this.productService.currentMessage.subscribe(product => {
      if (this.productList && product?.action == 'Add')
        this.productList.unshift(product);
      else if (this.productList && product?.action == 'Update') {
        this.productList[product.index] = product;
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
    this.productService.getProducts(this.utilService.getRequestParams(page, DamConstants.PAGE_SIZE, 'createdAt')).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(item => {
      this.productList = item?.content;
      this.page.totalItems = item?.totalElements;
    });
  }

  onEdit(product: Product, index: number) {
    this.productService.getValueBtn(2);
    this.productService.selectedProduct = Object.assign({}, product);
    this.productService.selectedProduct.index = index;
  }

  onDelete(product: Product, index: number) {

    const dialogRef = this.modalService.open(ConfirmDialogComponent);

    dialogRef.result.then(result => {

      if (result) {
        this.loading = true;
        this.productService.deleteProduct(product).pipe(finalize(() => {
          this.loading = false;
        })).subscribe(data => {
          this.productList.splice(index, 1);
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
