import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AppState } from '../shared/store/app-store';
import { AuthSelectors } from './store/auth.selectors';

export const authGuard: CanActivateFn = async () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  const loggedIn = await firstValueFrom(store.select(AuthSelectors.isLoggedIn));
  if (!loggedIn) router.navigateByUrl('/login');

  return loggedIn;
};
