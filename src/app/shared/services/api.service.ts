import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
// import {Http, ResponseContentType} from '@angular/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { JwtService } from './auth/jwt.service';
import { Config } from '../classes/config';
import { Pageable } from '../components/paging-lib/pageable';
import { Page } from '../components/paging-lib/page';

@Injectable()
export class ApiService {
  config = new Config();

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  private formatErrors(error: any) {
    console.log(error.error);
    return throwError(error.error);
  }

  public getPage(path: string, pageable: Pageable): Observable<Page<any>> {
    return this.http.get<Page<any>>(`${this.config.api}${path}` + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize).pipe(catchError(this.formatErrors));
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {

    return this.http.get(`${this.config.api}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  getFile(path: string): Observable<ArrayBuffer> {
    return this.http.get(`${this.config.api}${path}`, {
      responseType: 'arraybuffer'
    });
  }

  getGetFile(path: string): Observable<ArrayBuffer> {
    return this.http.get(`${this.config.api}${path}`, {
      responseType: 'arraybuffer'
    });
  }


  postGetFile(path: string, body: Object = {}): Observable<ArrayBuffer> {
    return this.http.post(`${this.config.api}${path}`, body, {
      responseType: 'arraybuffer'
    });
  }

  openFile(path: string, body: Object = {}): Observable<Blob> {
    return this.http.post(`${this.config.api}${path}`, JSON.stringify(body), {
      responseType: 'blob'
    });
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.config.api}${path}`,
      body
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}, params?: any): Observable<any> {
    return this.http.post(
      `${this.config.api}${path}`,
      body,
      {
        params: params
      }
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${this.config.api}${path}`
    ).pipe(catchError(this.formatErrors));
  }

  uploadFile(path, uploadFileData): Observable<any> {
    return this.http.post(`${this.config.api}${path}`, uploadFileData, { observe: 'response' })
      .pipe(catchError(this.formatErrors));
  }
}
