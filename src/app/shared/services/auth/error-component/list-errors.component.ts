import { Component, Input } from '@angular/core';
import { style } from '@angular/animations';


@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  styles:['.error-messages{list-style: none;background: #c51244 !important;padding: 10px !important;position: relative;display: inline-block !important;box-shadow: 1px 1px 1px #aaaaaa;margin-top: 10px;color: aliceblue !important;}']
})
export class ListErrorsComponent {


  formattedErrors: Array<string> = [];

  @Input()
  set errors(errorList: []) {
    this.formattedErrors = errorList;
  }

  get errorList() { return this.formattedErrors; }


}
