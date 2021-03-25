import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgProgress } from 'ngx-progressbar';
import { UtilsService } from '../../shared/services/utils.service';
import { Config } from '../../shared/classes/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductTypesService {
  private _productTypesUrl = `${new Config().api}/products/types`;
  private _headers = this._utils.makeHeaders({ withToken: true });

  constructor(
    private _utils: UtilsService,
    private _http: HttpClient,
    private _progress: NgProgress
  ) { }

  get(): Observable<any[]> {
    this.beforeRequest();

    return ;
  }

  beforeRequest(): void {
    // this._progress.start();
  }

  afterRequest(data: any): void {
    // this._progress.done();
  }

}
