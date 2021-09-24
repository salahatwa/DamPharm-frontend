import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { Analyis } from '../classes/analyis';

@Injectable({
  providedIn: 'root'
})
export class AnalyisService {



  constructor(private apiService: ApiService) { }

 

  getCounts(): Observable<Analyis> {
    return this.apiService.get('/analyis/counts').pipe(map(data => {
      return data;
    }));
  }

  // getCustomers(params: any): Observable<any> {
  //   return this.apiService.get('/customer', params).pipe(map(data => {
  //     return data;
  //   }));
  // }

  // insertCustomer(customer: Customer): Observable<Customer> {
  //   return this.apiService.post('/customer', customer).pipe(map(data => {
  //     data.action = 'Add';
  //     this.messageSource.next(data);
  //     return data;
  //   }));
  // }

  // updateCustomer(customer: Customer) {
  //   return this.apiService.put('/customer', customer).pipe(map(data => {
  //     customer.action = 'Update';
  //     this.messageSource.next(customer);
  //     return data;
  //   }));
  // }

  // deleteCustomer(customer: Customer) {
  //   return this.apiService.delete('/customer/' + customer?.id).pipe(map(data => {
  //     customer.action = 'Delete';
  //     this.messageSource.next(customer);
  //     return data;
  //   }));
  // }
}
