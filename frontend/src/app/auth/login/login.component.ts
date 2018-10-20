import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { AuthService } from '../../shared/services/auth.service';

import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLoading = false;
  form: FormGroup;

  @ViewChild('emailInput') emailInput: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement.focus();
    this._cd.detectChanges();
  }

  login(): void {
    this.isLoading = true;

    this._auth.login(this.form.value)
      .subscribe(
        (result: boolean) => {
          if ( result ) this._router.navigate(['/']);
        },
        () => this.isLoading = false
      );
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }
}
