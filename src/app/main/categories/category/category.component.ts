import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Category } from 'src/app/core/classes/category';
import { AlertType } from 'src/app/shared/components/alert/alert.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  loading: boolean = false;
  alert = { id: 'category-opt-alert', alertType: AlertType.ALINMA };
  categoryList: Category[];

  constructor(private translateService: TranslateService, private alertService: AlertService, public categoryService: CategoryService) { }



  ngOnInit() {
    this.categoryService.getValueBtn(1);
    this.resetForm();
  }

  onSubmit(categoryForm: NgForm) {
    this.loading = true;
    if (categoryForm.value.id == null)
      this.categoryService.insertCategory(categoryForm.value).pipe(finalize(() => {
        this.loading = false;
      })).subscribe(data => {
        this.alertService.success(this.translateService.instant('notify.success.add'), this.alert);
      }, err => {
        this.alertService.error(err.message, this.alert);
      });

    else {
      let category = categoryForm.value;
      category.index = this.categoryService.selectedCategory.index;
      this.categoryService.updateCategory(category).pipe(finalize(() => {
        this.loading = false;
      })).subscribe(data => {
        this.alertService.success(this.translateService.instant('notify.success.update'), this.alert);
      }, err => {
        this.alertService.error(err.message, this.alert);
      });
    }

    this.resetForm(categoryForm);
  }

  resetForm(categoryForm?: NgForm) {
    if (categoryForm != null)
      categoryForm.reset();
    this.categoryService.getValueBtn(1);
    this.categoryService.selectedCategory = new Category();
  }

}
