import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../shared/store/app-store';
import { AuthSelectors } from '../../../../../auth/store/auth.selectors';
import { AuthActions } from '../../../../../auth/store/auth.actions';
import { User } from '../../../../../auth/models/auth.models';
import { PageSectionTitleComponent } from '../../../../../shared/components/titles/page-section-title.component';
import { DialogEditUserComponent } from '../../dialogs/dialog-edit-user.component';
import { DialogDeleteAccountComponent } from '../../dialogs/dialog-delete-account.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button.component';

@Component({
  selector: 'setting-profile',
  templateUrl: './setting-profile.component.html',
  imports: [IconButtonComponent, PageSectionTitleComponent],
})
export class SettingProfileComponent {
  private dialog = inject(MatDialog);
  private store = inject<Store<AppState>>(Store);

  user!: User;
  userFullName = '...';
  userEmail = '...';

  constructor() {
    this.initObserverUserData();
  }

  private initObserverUserData() {
    this.store
      .select(AuthSelectors.loggedInUser)
      .pipe(takeUntilDestroyed())
      .subscribe((user?: User) => {
        if (!user) return;
        this.user = user;
        this.userFullName = `${user.firstName} ${user.lastName}`;
        this.userEmail = user.email;
      });
  }

  openDialogEditUser = (): void => {
    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      disableClose: true,
      autoFocus: false,
      data: { user: this.user },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) this.store.dispatch(AuthActions.loadUser());
    });
  };

  openDialogDeleteAccount = (): void => {
    this.dialog.open(DialogDeleteAccountComponent, {
      disableClose: true,
      autoFocus: false,
    });
  };
}
