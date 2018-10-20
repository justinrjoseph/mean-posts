import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorComponent } from '../error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const { error: errorMsg } = error;

          this._dialog.open(ErrorComponent, { data: {
            message: errorMsg || 'An unknown error occurred'
          }});

          return throwError(errorMsg);
        })
      );
  }
}
