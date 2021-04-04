import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { Product } from './../classes/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private messageSource: BehaviorSubject<Product> = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();

  productList: Product[];
  selectedProduct: Product = new Product();
  public valueBtn: string;

  constructor(private apiService: ApiService) { }

  getAllProducts(): Observable<any> {
    return this.apiService.get('/product/all').pipe(map(data => {
      return data;
    }));
  }

  getProducts(params: any): Observable<any> {
    // return this.productList = this.firebase.list('products');
    console.log(params);
    return this.apiService.get('/product', params).pipe(map(data => {
      return data;
    }));
  }

  getValueBtn(val) {
    if (val == 1)
      return this.valueBtn = 'Add';
    else
      return this.valueBtn = 'Update';
  }

  insertProduct(product: Product): Observable<Product> {
    return this.apiService.post('/product', product).pipe(map(data => {
      data.action = 'Add';
      this.messageSource.next(data);
      return data;
    }));
  }

  updateProduct(product: Product) {
    return this.apiService.put('/product', product).pipe(map(data => {
      data.action = 'Update';
      data.index = product.index;
      this.messageSource.next(data);
      return data;
    }));
  }

  deleteProduct(product: Product) {
    return this.apiService.delete('/product/' + product.id).pipe(map(data => {
      product.action = 'Delete';
      this.messageSource.next(product);
      return data;
    }));
  }
}
