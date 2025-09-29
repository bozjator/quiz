import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { AuthPageLayoutComponent } from '../auth-page-layout.component';
import { AlertComponent } from '../../../shared/components/alert.component';
import { AuthApiService } from '../../../shared/services/api/auth-api.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AuthPageLayoutComponent,
    AlertComponent,
  ],
})
export class ForgotPasswordComponent {
  private formBuilder = inject(FormBuilder);
  private authApiService = inject(AuthApiService);

  forgotPasswordForm: FormGroup;
  apiCallInProgress = signal(false);
  linkSendFinished = signal(false);
  errorMsg = signal('');

  constructor() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendResetPasswordLink() {
    this.apiCallInProgress.set(true);
    this.errorMsg.set('');
    const formValues: { email: string } = this.forgotPasswordForm.value;
    if (formValues.email.length <= 0) return;
    this.authApiService
      .startPasswordReset(formValues.email)
      .pipe(finalize(() => this.apiCallInProgress.set(false)))
      .subscribe({
        next: (value) => this.linkSendFinished.set(true),
        error: (error) => this.errorMsg.set('Error starting password reset.'),
      });
  }
}
