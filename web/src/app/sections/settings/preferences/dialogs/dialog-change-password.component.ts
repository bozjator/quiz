import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../shared/store/app-store';
import { AuthSelectors } from '../../../../auth/store/auth.selectors';
import { SharedFunctionsService } from '../../../../shared/services/shared-functions.service';
import { NotificationService } from '../../../../shared/components/others/notification/notification.service';
import { DialogComponent } from '../../../../shared/dialogs/dialog.component';
import { ChangePassword, LoginCredentials, User } from '../../../../auth/models/auth.models';
import { AuthApiService } from '../../../../shared/services/api/auth-api.service';
import { INPUT_LENGTHS } from '../../../../app.config';
import { AlertComponent, AlertType } from '../../../../shared/components/alert.component';
import { AuthActions } from '../../../../auth/store/auth.actions';

@Component({
  selector: 'app-dialog-change-password',
  template: `
    <app-dialog [title]="'Change password'">
      <div class="mt-6 w-64">
        <form [formGroup]="form" class="space-y-6">
          <mat-form-field style="width: 100%; margin: 0px;">
            <mat-label>New password</mat-label>
            <input
              matInput
              type="password"
              autocomplete="new-password"
              formControlName="newPassword"
            />
          </mat-form-field>

          <mat-form-field style="width: 100%; margin: 0px;">
            <mat-label>Current password</mat-label>
            <input
              matInput
              type="password"
              autocomplete="current-password"
              formControlName="currentPassword"
            />
          </mat-form-field>
        </form>

        <div class="mt-3">
          <app-alert
            [visible]="errorMessage().length > 0"
            [message]="errorMessage()"
            [type]="'red'"
          />
        </div>
      </div>
      <ng-container footer>
        @if (updateInProgress()) {
          <mat-spinner [diameter]="30"></mat-spinner>
        } @else {
          <button class="app-btn-sec" (click)="closeDialog(false)">Cancel</button>
          <button
            class="app-btn"
            [disabled]="!form.valid || form.pristine"
            (click)="changePassword()"
          >
            Change
          </button>
        }
      </ng-container>
    </app-dialog>
  `,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AlertComponent,
    DialogComponent,
  ],
})
export class DialogChangePasswordComponent {
  private dialogRef = inject<MatDialogRef<DialogChangePasswordComponent>>(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  private store = inject<Store<AppState>>(Store);
  private authApiService = inject(AuthApiService);
  private sharedFn = inject(SharedFunctionsService);
  private notificationService = inject(NotificationService);

  form!: FormGroup;

  updateInProgress = signal(false);
  errorMessage = signal('');

  userEmail = '...';

  constructor() {
    this.initObserverUserData();
    this.initForm();
  }

  private initForm() {
    const passwordValidators = [
      Validators.required,
      Validators.minLength(INPUT_LENGTHS.min.password),
      Validators.maxLength(INPUT_LENGTHS.max.password),
    ];
    this.form = this.formBuilder.group({
      newPassword: ['', passwordValidators],
      currentPassword: ['', passwordValidators],
    });
  }

  private initObserverUserData() {
    this.store
      .select(AuthSelectors.loggedInUser)
      .pipe(take(1))
      .subscribe((user?: User) => {
        if (!user) return;
        this.userEmail = user.email;
      });
  }

  private login = (password: string) => {
    const loginData: LoginCredentials = {
      email: this.userEmail,
      password,
    };
    this.store.dispatch(AuthActions.login({ payload: loginData }));
  };

  closeDialog(updateSuccessful: boolean) {
    this.dialogRef.close(updateSuccessful);
  }

  changePassword() {
    if (!this.form.valid) return;

    this.errorMessage.set('');
    this.updateInProgress.set(true);

    const formValues: ChangePassword = this.form.value;

    this.authApiService
      .changePassword(formValues)
      .pipe(finalize(() => this.updateInProgress.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.show('Password changed', {
            type: AlertType.blue,
          });
          this.login(formValues.newPassword);
          this.closeDialog(true);
        },
        error: (error) => this.errorMessage.set(this.sharedFn.getHttpErrorMessages(error)),
      });
  }
}
