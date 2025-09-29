import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, defer, of } from 'rxjs';
import { tap, map, catchError, exhaustMap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { LoginResponse } from '../models/auth.models';
import { AuthApiService } from '../../shared/services/api/auth-api.service';
import { UserApiService } from '../../shared/services/api/user-api.service';
import { InitialDataService } from '../../shared/store/initial-data.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private initialDataService = inject(InitialDataService);
  private authApiService = inject(AuthApiService);
  private userApiService = inject(UserApiService);

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        map((action) => action.payload),
        exhaustMap((payload) =>
          this.authApiService.login(payload).pipe(
            map((loginResponse) =>
              AuthActions.loginSuccess({
                payload: loginResponse,
              }),
            ),
            catchError((error) => of(AuthActions.loginFailure({ payload: error }))),
          ),
        ),
      ),
    { dispatch: true },
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        map((action) => action.payload),
        tap((loginResponse: LoginResponse) =>
          this.authService.setAccessToken(loginResponse.accessToken),
        ),
        tap(() => this.initialDataService.loadBase()),
        exhaustMap((loginResponse: LoginResponse) => {
          const registerRoute = '/register';
          const dashboardRedirectForRoutes = ['/login', '/reset-password'];

          // Should we redirect to dashboard?
          const mustRedirectToDashboard = dashboardRedirectForRoutes.some(
            (_) => this.router.url.indexOf(_) === 0,
          );

          this.router.navigateByUrl('/dashboard');

          return !loginResponse.user ? of(AuthActions.loadUser()) : EMPTY;
        }),
      ),
    { dispatch: true },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() =>
          this.authApiService.logout().pipe(
            map(() => AuthActions.logoutSuccess()),
            catchError((error) => {
              // If logout on the api failed, we still must remove local token,
              // because if api is not reachable or something, user still needs
              // to be signed out, in case if he is on a computer to which later
              // he will not have access.
              this.authService.logout();

              const alreadyLoggedOut = error.status === HttpStatusCode.Unauthorized;

              return of(
                alreadyLoggedOut
                  ? AuthActions.logoutSuccess()
                  : AuthActions.logoutFailure({ payload: error }),
              );
            }),
          ),
        ),
      ),
    { dispatch: true },
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.authService.logout();
          this.router.navigateByUrl('/logout');
        }),
      ),
    { dispatch: false },
  );

  loadUserData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loadUser),
        exhaustMap(() =>
          this.userApiService.getUser().pipe(
            map((user) => AuthActions.loadUserSuccess({ payload: user })),
            catchError((error) => of(AuthActions.loadUserFailure({ payload: error }))),
          ),
        ),
      ),
    { dispatch: true },
  );

  removeAccessToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.removeAccessToken),
        tap(() => this.authService.removeAccessToken()),
      ),
    { dispatch: false },
  );

  /**
   * Initial effect to load user API token from local storage into store and
   * then trigger 'login success' action.
   *
   * For some reason, init effect with the defere must be at the bottom of the file,
   * otherwise the returned action side effect is not called, only reducer is called.
   * https://github.com/ngrx/platform/issues/152#issuecomment-317308613
   */
  init$ = createEffect(() =>
    defer(() => {
      const storedAccessToken = this.authService.getAccessToken();
      const loggedIn = !!storedAccessToken;

      const isTokenExpired = loggedIn ? this.authService.isTokenExpired(storedAccessToken) : true;

      if (loggedIn && !isTokenExpired) {
        const loginResponse: LoginResponse = {
          accessToken: storedAccessToken,
          user: undefined,
        };
        return of(AuthActions.loginSuccess({ payload: loginResponse }));
      } else if (isTokenExpired) {
        this.authService.removeAccessToken();
      }

      return EMPTY;
    }),
  );
}
