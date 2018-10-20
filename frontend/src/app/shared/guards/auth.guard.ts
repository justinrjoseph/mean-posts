import { Injectable } from '@angular/core';

import { AuthService } from '../services/auth.service';

import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router) {}

  canActivate(): boolean {
    if ( !this._auth.loggedIn() ) {
      this._router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
