import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IInvoice } from 'src/app/core/classes/invoice';
import { maximum, minimum } from './../../../../shared/utils/validator';

@Component({
  selector: 'app-paid-dialog',
  templateUrl: './paid-dialog.component.html',
  styleUrls: ['./paid-dialog.component.scss']
})
export class PaidDialogComponent implements OnInit {

  _invoice: IInvoice;

  @Input() set invoice(invoiceDtls: IInvoice) {
    this._invoice = invoiceDtls;
    this.initForm();
  }


  selectedDate: Date = new Date();

  paidForm: FormGroup;
  constructor(private datepipe: DatePipe, public activeModal: NgbActiveModal, private _fb: FormBuilder) {

  }

  ngOnInit(): void {
  }


  initForm() {

    let data = {
      paidAt: { value: new Date(), disabled: false },
      paidAmt: { value: this._invoice.totalPrice, disabled: true }
    };

    if (!this._invoice.totalyPaid) {
      data = {
        paidAt: { value: this._invoice?.paidAt ? this._invoice?.paidAt : new Date(), disabled: false },
        paidAmt: { value: this._invoice.paidAmt, disabled: false }
      };
    }

    let currentDate = this.datepipe.transform(data?.paidAt?.value, 'yyyy-MM-dd');

    this.paidForm = this._fb.group({
      paidAmt: new FormControl({ value: data?.paidAmt?.value, disabled: data?.paidAmt?.disabled }, [minimum(this._invoice.totalPrice),Validators.required]),
      paidDate: new FormControl({ value: new Date(currentDate), disabled: data?.paidAt?.disabled }, [Validators.required]),
    });
  }

}
