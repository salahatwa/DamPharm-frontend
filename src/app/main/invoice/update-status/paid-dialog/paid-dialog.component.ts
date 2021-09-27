import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-paid-dialog',
  templateUrl: './paid-dialog.component.html',
  styleUrls: ['./paid-dialog.component.scss']
})
export class PaidDialogComponent implements OnInit {

  selectedDate: Date = new Date();

  constructor(private datepipe: DatePipe, public activeModal: NgbActiveModal) {
    let currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.selectedDate = new Date(currentDate);
  }

  ngOnInit(): void {
  }

}
