import { Customer } from './customer';
import { Product } from './product';

export class IInvoice {
  $key?: string;
  invoiceNumber?: number;
  uid?: string;
  customer: Customer;
  items: ItemInvoice[];
  totalPrice: number;
}

export interface ItemInvoice {
  product: Product;
  quantity: number;
  // amount: number;
}

