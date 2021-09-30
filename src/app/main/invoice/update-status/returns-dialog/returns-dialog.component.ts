import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IInvoice, ItemInvoice } from 'src/app/core/classes/invoice';
import { minimum } from './../../../../shared/utils/validator';

@Component({
  selector: 'app-returns-dialog',
  templateUrl: './returns-dialog.component.html',
  styleUrls: ['./returns-dialog.component.scss']
})
export class ReturnsDialogComponent implements OnInit {

  selectedDate: Date = new Date();

  _invoice: IInvoice;

  @Input() set invoice(invoiceDtls: IInvoice) {
    this._invoice = invoiceDtls;
    this.initForm();
  }

  returnsForm: FormGroup;

  constructor(private datepipe: DatePipe, public activeModal: NgbActiveModal, private _fb: FormBuilder) {
    let currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.selectedDate = new Date(currentDate);
  }

  ngOnInit(): void {
  }

  initForm() {
    let currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.returnsForm = this._fb.group({
      id: this._invoice.id,
      items: this._fb.array(
        this._invoice.items.map(item => this.newInvoiceItem(item))
      ),
      returnsDate: new FormControl(new Date(currentDate), [Validators.required]),
    });
  }

  get returnsItems() {
    return this.returnsForm.controls.items as FormArray;
  }

  newInvoiceItem(item: ItemInvoice) {
    return this._fb.group({
      id: [item?.id],
      quantity: [item?.quantity],
      name: [item?.product?.name],
      returns: [item?.returns, [Validators.required, minimum(item?.quantity), Validators.pattern(/^[1-9]\d*$/)]]
    });
  }



}
