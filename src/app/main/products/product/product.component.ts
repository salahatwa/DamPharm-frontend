import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertType } from 'src/app/shared/components/alert/alert.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { Category } from './../../../core/classes/category';
import { Product } from './../../../core/classes/product';
import { CategoryService } from './../../../core/services/category.service';
import { ProductService } from './../../../core/services/product.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  alert = { id: 'product-opt-alert', alertType: AlertType.ALINMA };
  public selectUndefinedOptionValue: any;
  categoryList: Category[];
  showDialog;


  constructor(public productService: ProductService, public categoryService: CategoryService, private translateService: TranslateService, private alertService: AlertService) { }

  ngOnInit() {
    // this.productService.getProducts();
    this.resetForm();
    this.productService.getValueBtn(1);
    this.categoryService.getAllCategories().subscribe(items => {
      this.categoryList = items;
    });
  }

  onSubmit(productForm: NgForm) {
    this.productService.getValueBtn(1);
    if (productForm.value.id == null)
      this.productService.insertProduct(productForm.value).subscribe(data => {
        this.alertService.success(this.translateService.instant('notify.success.add'), this.alert);
      }, err => {
        this.alertService.error(err.message, this.alert);
      });
    else
    {
      let req:Product=productForm.value;
      req.index=this.productService.selectedProduct.index;

      this.productService.updateProduct(req).subscribe(data => {
        this.alertService.success(this.translateService.instant('notify.success.update'), this.alert);
      }, err => {
        this.alertService.error(err.message, this.alert);
      });
    }
    this.resetForm(productForm);
  }

  resetForm(productForm?: NgForm) {
    if (productForm != null)
      productForm.reset();
    this.productService.selectedProduct = new Product();
    this.productService.getValueBtn(1);
  }

}


