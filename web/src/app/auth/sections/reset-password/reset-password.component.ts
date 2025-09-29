import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthPageLayoutComponent } from '../auth-page-layout.component';
import { AppState } from '../../../shared/store/app-store';
import { LoginCredentials, ResetPassword } from '../../models/auth.models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { AuthApiService } from '../../../shared/services/api/auth-api.service';
import { INPUT_LENGTHS } from '../../../app.config';
import { AuthActions } from '../../store/auth.actions';

interface ResetPasswordForm {
  email: string;
  password: string;
  rePassword: string;
}

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AuthPageLayoutComponent,
    AlertComponent,
  ],
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject<Store<AppState>>(Store);
  private formBuilder = inject(FormBuilder);
  private authApiService = inject(AuthApiService);

  resetPasswordId = '';

  resetPasswordForm: FormGroup;
  apiCallInProgress = signal(false);
  passwordResetSuccess = signal(false);
  errorMsg = signal('');

  constructor() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(INPUT_LENGTHS.min.password),
          Validators.maxLength(INPUT_LENGTHS.max.password),
        ],
      ],
      rePassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.resetPasswordId = this.route.snapshot.paramMap.get('uuid') ?? '';
  }

  private login = () => {
    const loginData: LoginCredentials = {
      email: this.resetPasswordForm.value.email,
      password: this.resetPasswordForm.value.password,
    };
    this.store.dispatch(AuthActions.login({ payload: loginData }));
  };

  private validatePasswordReEnter(): boolean {
    const formValues: ResetPasswordForm = this.resetPasswordForm.value;
    if (formValues.password !== formValues.rePassword) {
      this.errorMsg.set(`Passwords do not match.`);
      return false;
    }
    return true;
  }

  resetPassword(): void {
    const passwordReEnterOk = this.validatePasswordReEnter();
    if (!passwordReEnterOk) return;

    const formValues: ResetPasswordForm = this.resetPasswordForm.value;

    const data: ResetPassword = {
      email: formValues.email,
      newPassword: formValues.password,
      resetPasswordId: this.resetPasswordId,
    };

    this.errorMsg.set('');
    this.apiCallInProgress.set(true);
    this.authApiService
      .passwordReset(data)
      .pipe(finalize(() => this.apiCallInProgress.set(false)))
      .subscribe({
        next: (value) => {
          this.passwordResetSuccess.set(true);
          setTimeout(this.login, 3000);
        },
        error: (error) => {
          console.error(error);
          this.errorMsg.set('Error resetting your password.');
        },
      });
  }
}
