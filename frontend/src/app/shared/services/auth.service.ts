import { environment } from '../../../environments/environment';

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Jwt } from '../models/jwt';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usersApi = `${environment.api}/users`;
  private _authApi = `${environment.api}/auth`;

  private _jwtHelper = new JwtHelperService();
  private _loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient, private _router: Router) {}

  register(user: User): Observable<boolean> {
    return this._processUser(this._usersApi, user);
  }

  login(user: User): Observable<boolean> {
    return this._processUser(this._authApi, user);
  }

  logout(): void {
    localStorage.removeItem('token');

    this._updateLoggedInStatus(false);

    this._router.navigate(['/']);
  }

  loggedIn(): Observable<boolean> {
    if ( this.token ) {
      const tokenValid = !this._jwtHelper.isTokenExpired(this.token);

      this._updateLoggedInStatus(tokenValid);
    }

    return this._loggedIn.asObservable();
  }

  get currentUser(): User | null {
    if ( !this.token ) return null;

    return this._jwtHelper.decodeToken(this.token);
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  private _processUser(url, user): Observable<boolean> {
    return this._http.post(url, user)
      .pipe(
        map((response: Jwt) => {
          if ( response && response.token ) {
            localStorage.setItem('token', response.token);

            this._updateLoggedInStatus(true);
            return true;
          }

          this._updateLoggedInStatus(false);
          return false;
        }
      ));
  }

  private _updateLoggedInStatus(status): void {
    this._loggedIn.next(status);
  }
}
