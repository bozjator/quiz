import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { AuthPageLayoutComponent } from '../auth-page-layout.component';
import { AuthActions } from '../../store/auth.actions';
import { AppState } from '../../../shared/store/app-store';
import { AuthSelectors } from '../../store/auth.selectors';

@Component({
  selector: 'logout',
  imports: [RouterModule, MatProgressSpinnerModule, AuthPageLayoutComponent],
  templateUrl: './logout.component.html',
})
export class LogoutComponent {
  private readonly store = inject<Store<AppState>>(Store);

  isUserLoggedOut: boolean = false;

  constructor() {
    this.store
      .select(AuthSelectors.isLoggedIn)
      .pipe(takeUntilDestroyed())
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) this.store.dispatch(AuthActions.logout());
        this.isUserLoggedOut = !isLoggedIn;
      });
  }
}
