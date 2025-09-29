import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { PageSectionTitleComponent } from '../../../../../shared/components/titles/page-section-title.component';
import { ConfirmationDialogComponent } from '../../../../../shared/dialogs/confirmation.dialog';
import { AuthApiService } from '../../../../../shared/services/api/auth-api.service';
import { NotificationService } from '../../../../../shared/components/others/notification/notification.service';
import { AlertType } from '../../../../../shared/components/alert.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button.component';
import { DialogChangePasswordComponent } from '../../dialogs/dialog-change-password.component';

@Component({
  selector: 'setting-security',
  templateUrl: './setting-security.component.html',
  imports: [
    MatProgressSpinnerModule,
    PageSectionTitleComponent,
    IconButtonComponent,
  ],
})
export class SettingSecurityComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private authApiService = inject(AuthApiService);

  signOut = {
    apiCallInProgress: signal(false),
  };

  private signOutEverywhere() {
    this.signOut.apiCallInProgress.set(true);
    this.authApiService
      .logoutEverywhere()
      .pipe(finalize(() => this.signOut.apiCallInProgress.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.show('Successfully signed out everywhere.', {
            type: AlertType.green,
          });
          this.router.navigateByUrl('/logout');
        },
        error: () =>
          this.notificationService.show('Failed to sign out everywhere.', {
            type: AlertType.red,
          }),
      });
  }

  startSignOutEverywhere() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        content: `This will sign you out across all browsers and ATT applications.`,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) this.signOutEverywhere();
    });
  }

  openDialogChangePassword = (): void => {
    this.dialog.open(DialogChangePasswordComponent, {
      disableClose: true,
      autoFocus: false,
    });
  };
}
