import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-section-loading',
    template: `
  <div *ngIf="isLoading" class="loading-section d-flex flex-column align-items-center justify-content-center">
    <div class="row">
      <div class="spinner-border spinner-border-lg itp-color" style="width: 6rem; height: 6rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="row">
      <strong>{{text}}</strong>
    </div>
  </div>
  `,
    styles: []
})

export class SectionLoadingComponent implements OnInit {
    @Input() isLoading: boolean = false;
    @Input() text: string;

    constructor(private translateService: TranslateService) { }

    ngOnInit(): void {
        if (!this.text || this.text == null || this.text == '')
            this.text = this.translateService.instant('common.loading');
    }

}