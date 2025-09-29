import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertComponent } from '../../../../shared/components/alert.component';
import { DialogComponent } from '../../../../shared/dialogs/dialog.component';
import { User, UserUpdate } from '../../../../auth/models/auth.models';
import { UserApiService } from '../../../../shared/services/api/user-api.service';
import { finalize } from 'rxjs';
import { SharedFunctionsService } from '../../../../shared/services/shared-functions.service';
import { AuthApiService } from '../../../../shared/services/api/auth-api.service';
import { INPUT_LENGTHS } from '../../../../app.config';

@Component({
  selector: 'app-dialog-edit-user',
  template: `
    <app-dialog [title]="'Edit user'">
      <div class="mt-6 w-64">
        <form [formGroup]="editForm" class="space-y-6">
          <mat-form-field style="width: 100%; margin: 0px;">
            <mat-label>First name</mat-label>
            <input matInput autocomplete="given-name" formControlName="firstName" />
          </mat-form-field>
          <mat-form-field style="width: 100%; margin: 0px;">
            <mat-label>Last name</mat-label>
            <input matInput autocomplete="family-name" formControlName="lastName" />
          </mat-form-field>
          <mat-form-field style="width: 100%; margin: 0px;">
            <mat-label>Email</mat-label>
            <input matInput autocomplete="email" formControlName="email" />
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
        @if (updateInProgress) {
          <mat-spinner [diameter]="30"></mat-spinner>
        } @else {
          <button class="app-btn-sec" (click)="closeDialog(false)">Cancel</button>
          <button
            class="app-btn"
            [disabled]="!editForm.valid || editForm.pristine"
            (click)="onUpdate()"
          >
            Save
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
export class DialogEditUserComponent {
  private dialogRef = inject<MatDialogRef<DialogEditUserComponent>>(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  private userApiService = inject(UserApiService);
  private authApiService = inject(AuthApiService);
  private sharedFn = inject(SharedFunctionsService);

  editForm: FormGroup;
  user!: User;

  updateInProgress = false;
  errorMessage = signal('');

  constructor() {
    const data = inject<{ user: User }>(MAT_DIALOG_DATA);
    this.user = data.user;

    this.editForm = this.formBuilder.group({
      firstName: [
        this.user.firstName,
        [Validators.required, Validators.maxLength(INPUT_LENGTHS.max.firstName)],
      ],
      lastName: [
        this.user.lastName,
        [Validators.required, Validators.maxLength(INPUT_LENGTHS.max.lastName)],
      ],
      email: [
        this.user.email,
        [Validators.required, Validators.email, Validators.maxLength(INPUT_LENGTHS.max.email)],
      ],
      currentPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(INPUT_LENGTHS.min.password),
          Validators.maxLength(INPUT_LENGTHS.max.password),
        ],
      ],
    });
  }

  closeDialog(updateSuccessful: boolean) {
    this.dialogRef.close(updateSuccessful);
  }

  onUpdate() {
    if (!this.editForm.valid) return;

    this.errorMessage.set('');
    this.updateInProgress = true;

    const formValues: UserUpdate = this.editForm.value;

    const updateUserData = () =>
      this.userApiService
        .updateUser(formValues)
        .pipe(finalize(() => (this.updateInProgress = false)))
        .subscribe({
          next: (_) => this.closeDialog(true),
          error: (error) => {
            this.errorMessage.set('Failed to update: ' + this.sharedFn.getHttpErrorMessages(error));
          },
        });

    // Check if current password is correct.
    this.authApiService.checkPassword(formValues.currentPassword).subscribe({
      next: (passwordCorrect: boolean) => {
        if (passwordCorrect) updateUserData();
        else {
          this.updateInProgress = false;
          this.errorMessage.set('Current password is invalid.');
        }
      },
      error: () => {
        this.errorMessage.set('Failed to check if current password is valid.');
      },
    });
  }
}
