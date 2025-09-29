import { Component, OnInit, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import { AuthPageLayoutComponent } from '../auth-page-layout.component';
import { AppState } from '../../../shared/store/app-store';
import { LoginCredentials, User } from '../../models/auth.models';
import { AuthActions } from '../../store/auth.actions';
import { AuthSelectors } from '../../store/auth.selectors';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AuthPageLayoutComponent,
    AlertComponent,
  ],
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private store = inject<Store<AppState>>(Store);

  loginForm: FormGroup;
  loginInProgress = signal(false);
  loginErrorMsg = signal('');

  readonly showAsRelogin = input(false);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.setUserEmail();
    this.setListenerOnLoginFailed();
  }

  async ngOnInit(): Promise<void> {
    const isDemoSet = await this.isDemoParamSet();
    if (isDemoSet) this.enterDemoUserLoginData();
    else this.checkIfAlreadyLoggedIn();
  }

  private async isDemoParamSet(): Promise<boolean> {
    const paramMap = await firstValueFrom(this.route.queryParams);
    const isDemoSet = !!paramMap['demo'];
    return isDemoSet;
  }

  private enterDemoUserLoginData(): void {
    this.loginForm.patchValue({ email: 'demo@app.com' });
    this.loginForm.patchValue({ password: 'demo1234' });
  }

  private async checkIfAlreadyLoggedIn(): Promise<void> {
    const loggedIn = await firstValueFrom(this.store.select(AuthSelectors.isLoggedIn));
    if (loggedIn) this.router.navigateByUrl('');
  }

  setUserEmail() {
    this.store
      .select(AuthSelectors.loggedInUser)
      .pipe(take(1))
      .subscribe((user?: User) => {
        if (user && user.email) this.loginForm.patchValue({ email: user.email });
      });
  }

  setListenerOnLoginFailed() {
    this.store
      .select(AuthSelectors.loginFailureError)
      .pipe(takeUntilDestroyed())
      .subscribe((error?: HttpErrorResponse) => {
        if (error) this.loginInProgress.set(false);
        this.loginErrorMsg.set(error ? 'Please check your login credentials.' : '');
      });
  }

  login() {
    this.loginInProgress.set(true);
    this.loginErrorMsg.set('');
    const formValues: LoginCredentials = this.loginForm.value;
    this.store.dispatch(AuthActions.login({ payload: formValues }));
  }
}
