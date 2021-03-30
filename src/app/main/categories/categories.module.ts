import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AuthModule } from 'src/app/shared/services/auth/auth.module';
import { CategoriesComponent } from './categories.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryComponent } from './category/category.component';


@NgModule({
  declarations: [CategoriesComponent, CategoryListComponent, CategoryComponent],
  imports: [
    SharedModule,
    AuthModule,
    CommonModule
  ]
})
export class CategoriesModule { }
