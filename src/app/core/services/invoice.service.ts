import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { IInvoice } from './../classes/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  invoiceList: [];
  selectedInvoice: IInvoice = new IInvoice();

  constructor(private apiService: ApiService) {
  }

  getInvoices(params: any): Observable<any> {
    return this.apiService.get('/invoice', params).pipe(map(data => {
      this.invoiceList = data;
      return data;
    }));
  }

  insertInvoice(invoice: IInvoice): Observable<IInvoice> {
    console.log(invoice);
    return this.apiService.post('/invoice', invoice).pipe(map(data => {
      return data;
    }));
  }

  updateInvoice(invoice: IInvoice) {
    return this.apiService.put('/invoice', invoice).pipe(map(data => {
      return data;
    }));
  }

  deleteInvoice(id: string) {
    return this.apiService.delete('/invoice/' + id).pipe(map(data => {
      return data;
    }));
  }

  money(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  }
}
