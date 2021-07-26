import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from '../utils.service';
import { JwtService } from './jwt.service';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService, private router: Router, private utilService: UtilsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/json',
      // 'Cache-Control': 'no-cache',
      // 'Access-Control-Allow-Origin': '*'
    };

    const token = this.jwtService.getToken();

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const lang = this.utilService.getCurrentLang();

    if (lang) {
      headersConfig['Accept-Language'] = `${lang}`;
    } else

      headersConfig['Accept-Language'] = `ar`;

    // console.log('TOKEN:'+token);

    const request = req.clone({ setHeaders: headersConfig, withCredentials: false });

    return next.handle(request).pipe(
      catchError(
        (err, caught) => {
          if (err.status === 401) {
            this.handleAuthError();
            return of(err);
          }
          throw err;
        }
      )
    );
  }
  private handleAuthError() {
    this.jwtService.destroyToken();
    this.router.navigateByUrl('/login');
  }
}
