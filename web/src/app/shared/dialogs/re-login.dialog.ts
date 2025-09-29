import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { opacityAnimation } from '../animations';
import { LoginComponent } from '../../auth/sections/login/login.component';
import { AppState } from '../store/app-store';
import { AuthSelectors } from '../../auth/store/auth.selectors';

@Component({
  selector: 'app-relogin-dialog',
  template: `
    <div
      class="fixed inset-0 z-10 overflow-y-auto backdrop-blur-sm"
      role="dialog"
      [@opacityAnimation]
    >
      <div
        class="block min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:p-0"
      >
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle">
          &#8203;
        </span>
        <div
          class="relative inline-block transform overflow-hidden rounded-lg text-left align-middle shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <login [showAsRelogin]="true" />
        </div>
      </div>
    </div>
  `,
  animations: [opacityAnimation],
  imports: [LoginComponent],
})
export class ReLoginDialogComponent {
  private store = inject<Store<AppState>>(Store);
  private dialogRef =
    inject<MatDialogRef<ReLoginDialogComponent>>(MatDialogRef);

  constructor() {
    this.setListenerOnUserLoggedIn();
  }

  setListenerOnUserLoggedIn() {
    this.store
      .select(AuthSelectors.isLoggedIn)
      .pipe(takeUntilDestroyed())
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) this.dialogRef.close(true);
      });
  }
}
