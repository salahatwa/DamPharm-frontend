import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-no-result-found',
    template: `<div class="text-center mt-3" *ngIf="display">
  <img src="./assets/images/no-data.svg" class="no-data-img" />
  <h3 class="section-title">{{'common.search.emptyResult'|translate}}</h3>
</div>`,
    styles: []

})

export class NoResultFound implements OnInit {
    @Input() display: boolean;

    constructor(private translateService: TranslateService) { }

    ngOnInit(): void { }

}