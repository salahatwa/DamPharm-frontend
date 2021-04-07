import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { Customer } from '../classes/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private messageSource: BehaviorSubject<Customer> = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();

  selectedCustomer: Customer = new Customer();

  public valueBtn: string;

  constructor(private apiService: ApiService) { }

  getValueBtn(val) {
    if (val == 1)
      return this.valueBtn = 'Add';
    else
      return this.valueBtn = 'Update';
  }

  getAllCustomers(): Observable<any> {
    return this.apiService.get('/customer/all').pipe(map(data => {
      return data;
    }));
  }

  getCustomers(params: any): Observable<any> {
    return this.apiService.get('/customer', params).pipe(map(data => {
      return data;
    }));
  }

  insertCustomer(customer: Customer): Observable<Customer> {
    return this.apiService.post('/customer', customer).pipe(map(data => {
      data.action = 'Add';
      this.messageSource.next(data);
      return data;
    }));
  }

  updateCustomer(customer: Customer) {
    return this.apiService.put('/customer', customer).pipe(map(data => {
      customer.action = 'Update';
      this.messageSource.next(customer);
      return data;
    }));
  }

  deleteCustomer(customer: Customer) {
    return this.apiService.delete('/customer/' + customer?.id).pipe(map(data => {
      customer.action = 'Delete';
      this.messageSource.next(customer);
      return data;
    }));
  }
}
