import { Customer } from './customer';
import { Product } from './product';

export class IInvoice {
  id?: string;
  createdAt:string;
  invoiceNumber?: number;
  uid?: string;
  customer: Customer;
  items: ItemInvoice[];
  totalPrice: number;
}

export interface ItemInvoice {
  product: Product;
  quantity: number;
  discount: number;
  // amount: number;
}

