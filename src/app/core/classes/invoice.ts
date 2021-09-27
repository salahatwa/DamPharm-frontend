import { Customer } from './customer';
import { Product } from './product';

export class IInvoice {
  id?: string;
  createdAt: string;
  invoiceNumber?: number;
  status?: InvoiceStatus = InvoiceStatus.NEW;
  uid?: string;
  customer: Customer;
  items: ItemInvoice[];
  totalPrice: number;
}

export interface ItemInvoice {
  product: Product;
  quantity: number;
  discount: number;
  bonus: number;
  totalAfterDiscount: number;
}

export interface InvoiceStatusUpdate {
  id?: string;
  paidDate?: Date;
  status?: InvoiceStatus;
}


export enum InvoiceStatus {
  NEW = 0,
  PAID = 1,
  RETURNS = 2,
  CANCELED = 3,
  DRAFT = 4
}