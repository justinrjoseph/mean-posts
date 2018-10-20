import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { AuthService } from '../services/auth.service';

import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq;

    if ( req.url.match(/posts/) && req.method.match(/POST|PUT|DELETE/) ) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this._auth.token}`)
      });
    }

    return next.handle(authReq || req);
  }
}
