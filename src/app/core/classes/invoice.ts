import { Customer } from './customer';
import { Product } from './product';

export class IInvoice {
  id?: string;
  createdAt: string;
  paidAt: Date;
  invoiceNumber?: number;
  status?: InvoiceStatus = InvoiceStatus.NEW;
  uid?: string;
  customer: Customer;
  items: ItemInvoice[];
  totalPrice: number;
  paidAmt: number;
  totalyPaid: boolean;
}

export interface ItemInvoice {
  id: number;
  product: Product;
  quantity: number;
  discount: number;
  bonus: number;
  totalAfterDiscount: number;
  returns?: number;
}

export interface InvoiceStatusUpdate {
  id?: string;
  paidDate?: Date;
  paidAmt?: number;
  returnsDate?: Date;
  status?: InvoiceStatus;
  cancel?: boolean;
  items?: ItemInvoice[];
}


export enum InvoiceStatus {
  NEW = 0,
  PAID = 1,
  RETURNS = 2,
  CANCELED = 3,
  PAID_PARTIALLY = 4
}