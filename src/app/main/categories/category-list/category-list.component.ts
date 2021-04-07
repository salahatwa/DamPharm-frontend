import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Category } from 'src/app/core/classes/category';
import { CategoryService } from 'src/app/core/services/category.service';
import { AlertType } from 'src/app/shared/components/alert/alert.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { UtilsService } from './../../../shared/services/utils.service';
import { DamConstants } from './../../../shared/utils/constants';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  alert = { id: 'category-list-alert', alertType: AlertType.ALINMA };
  subscription: Subscription;
  loading: boolean;
  page = { id: 'category-list', itemsPerPage: DamConstants.PAGE_SIZE, currentPage: 1, totalItems: 0 };

  categoryList: Category[] = [];
  constructor(private translateService: TranslateService, private alertService: AlertService, public categoryService: CategoryService, public utilService: UtilsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.subscription = this.categoryService.currentMessage.subscribe(category => {
      if (this.categoryList && category?.action == 'Add')
        this.categoryList.unshift(category);
      else if (this.categoryList && category?.action == 'Update') {
        console.log(category);
        this.categoryList[category.index] = category;
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
    this.categoryService.getCategories(this.utilService.getRequestParams(page, DamConstants.PAGE_SIZE, 'createdAt')).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(item => {
      this.categoryList = item?.content;
      this.page.totalItems = item?.totalElements;
    });
  }


  onEdit(category: Category, index: number) {
    this.categoryService.getValueBtn(2);
    this.categoryService.selectedCategory = Object.assign({}, category);
    this.categoryService.selectedCategory.index = index;
  }

  onDelete(category: Category, index: number) {

    const dialogRef = this.modalService.open(ConfirmDialogComponent);

    dialogRef.result.then(result => {

      if (result) {
        this.loading = true;
        this.categoryService.deleteCategory(category).pipe(finalize(() => {
          this.loading = false;
        })).subscribe(data => {
          this.categoryList.splice(index, 1);
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
