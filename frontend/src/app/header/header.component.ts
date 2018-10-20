import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.loggedIn()
      .subscribe((isLoggedIn: boolean) => this.loggedIn = isLoggedIn);
  }

  logout() {
    this.auth.logout();
  }
}
