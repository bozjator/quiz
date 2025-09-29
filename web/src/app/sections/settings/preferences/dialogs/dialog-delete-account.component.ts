import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { SharedFunctionsService } from '../../../../shared/services/shared-functions.service';
import { DialogComponent } from '../../../../shared/dialogs/dialog.component';
import { CurrentPassword } from '../../../../auth/models/auth.models';
import { AlertComponent } from '../../../../shared/components/alert.component';
import { UserApiService } from '../../../../shared/services/api/user-api.service';
import { INPUT_LENGTHS } from '../../../../app.config';

@Component({
  selector: 'app-dialog-change-password',
  template: `
    <app-dialog [title]="'Delete account'">
      @if (accountDeleted()) {
        <div class="max-w-[600px] text-neutral-800 dark:text-white">
          Your account has been successfully deleted.
          <br />
          <br />
          We're sorry to see you leave and would appreciate any feedback you might have. If you ever
          decide to return or if you have any concerns, feel free to reach out to us. Thank you for
          having been with us.
          <br />
          <br />

          <div class="text-center">
            <a href="https://app.com" class="underline">app.com</a>
          </div>
        </div>
      }

      @if (!accountDeleted()) {
        <div class="max-w-[600px] text-neutral-800 dark:text-white">
          <div class="mb-4 text-sm">
            <div class="mb-2">We're sorry to see you go!</div>
            If there's anything we can do to improve your experience or if you're facing any issues,
            <br />
            please let us know before you delete your account.
            <br />
            We'd love to hear from you. Contact us at info&#64;app.com
          </div>
          <p class="font-bold">
            Your account and all associated data will be permanently deleted.
            <br />
            Are you sure you want to proceed?
          </p>
        </div>

        <div class="mt-6">
          <form [formGroup]="form" class="space-y-6">
            <mat-form-field style="width: 100%; margin: 0px;">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                autocomplete="current-password"
                formControlName="currentPassword"
              />
            </mat-form-field>
          </form>

          <div class="float-right w-full text-right font-bold text-red-800 dark:text-red-900">
            Warning: This action is irreversible.
          </div>

          <div class="mt-3">
            <app-alert
              [visible]="errorMessage().length > 0"
              [message]="errorMessage()"
              [type]="'red'"
            />
          </div>
        </div>
      }

      @if (!accountDeleted()) {
        <ng-container footer>
          @if (apiCallInProgress()) {
            <mat-spinner [diameter]="30"></mat-spinner>
          } @else {
            <button class="app-btn-sec" (click)="closeDialog(false)">Cancel</button>
            <button
              class="app-btn bg-red-400 text-red-800 hover:bg-red-300"
              [disabled]="!form.valid || form.pristine"
              (click)="deleteAccount()"
            >
              DELETE ACCOUNT
            </button>
          }
        </ng-container>
      }
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
export class DialogDeleteAccountComponent {
  private dialogRef = inject<MatDialogRef<DialogDeleteAccountComponent>>(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  private userApiService = inject(UserApiService);
  private sharedFn = inject(SharedFunctionsService);

  form!: FormGroup;

  apiCallInProgress = signal(false);
  errorMessage = signal('');
  accountDeleted = signal(false);

  constructor() {
    this.initForm();
  }

  private initForm() {
    const passwordValidators = [
      Validators.required,
      Validators.minLength(INPUT_LENGTHS.min.password),
      Validators.maxLength(INPUT_LENGTHS.max.password),
    ];
    this.form = this.formBuilder.group({
      currentPassword: ['', passwordValidators],
    });
  }

  closeDialog(updateSuccessful: boolean) {
    this.dialogRef.close(updateSuccessful);
  }

  deleteAccount() {
    if (!this.form.valid) return;

    this.errorMessage.set('');
    this.apiCallInProgress.set(true);

    const formValues: CurrentPassword = this.form.value;

    this.userApiService
      .deleteAccount(formValues)
      .pipe(finalize(() => this.apiCallInProgress.set(false)))
      .subscribe({
        next: () => {
          this.accountDeleted.set(true);
          window.localStorage.clear();
        },
        error: (error) => this.errorMessage.set(this.sharedFn.getHttpErrorMessages(error)),
      });
  }
}
