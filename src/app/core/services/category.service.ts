import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { Category } from '../classes/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private messageSource: BehaviorSubject<Category> = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();

  selectedCategory: Category = new Category();
  public valueBtn: string;

  constructor(private apiService: ApiService) { }

  getValueBtn(val) {
    if (val == 1)
      return this.valueBtn = 'إضافة';
    else
      return this.valueBtn = 'تحديث';
  }
  
  getAllCategories(): Observable<any> {
    return this.apiService.get('/category/all').pipe(map(data => {
      return data;
    }));
  }

  getCategories(params: any): Observable<any> {
    return this.apiService.get('/category', params).pipe(map(data => {
      return data;
    }));
  }

  insertCategory(category: Category): Observable<Category> {
    return this.apiService.post('/category', category).pipe(map(data => {
      data.action = 'Add';
      this.messageSource.next(data);
      return data;
    }));
  }

  updateCategory(category: Category) {
    return this.apiService.put('/category', category).pipe(map(data => {
      category.action = 'Update';
      this.messageSource.next(category);
      return data;
    }));
  }

  deleteCategory(category: Category) {
    return this.apiService.delete('/category/' + category.id).pipe(map(data => {
      category.action = 'Delete';
      this.messageSource.next(category);
      return data;
    }));
  }
}
