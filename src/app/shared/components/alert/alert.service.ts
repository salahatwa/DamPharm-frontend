import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert, AlertType, MsgType } from './alert.model';


@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';


  constructor() {

  }


  options = {
    autoClose: true,
    keepAfterRouteChange: false,
    duplicat: false,
    alertType: AlertType.DEFAULT
  };

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  // convenience methods
  success(message: string, options?: any) {
    let alertOptions = Object.assign({}, this.options, options);
    this.alert(new Alert({ ...alertOptions, msgType: MsgType.Success, message }));
  }

  error(message: string, options?: any) {
    let alertOptions = Object.assign({}, this.options, options);
    this.alert(new Alert({ ...alertOptions, msgType: MsgType.Error, message }));
  }

  info(message: string, options?: any) {
    let alertOptions = Object.assign({}, this.options, options);
    this.alert(new Alert({ ...alertOptions, msgType: MsgType.Info, message }));
  }

  warn(message: string, options?: any) {
    let alertOptions = Object.assign({}, this.options, options);
    this.alert(new Alert({ ...alertOptions, msgType: MsgType.Warning, message }));
  }

  // main alert method    
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}