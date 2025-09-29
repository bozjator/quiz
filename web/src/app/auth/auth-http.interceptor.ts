import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { AppState } from '../shared/store/app-store';
import { AuthSelectors } from './store/auth.selectors';
import { ReLoginDialogComponent } from '../shared/dialogs/re-login.dialog';
import { AuthActions } from './store/auth.actions';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  private store = inject<Store<AppState>>(Store);
  private dialog = inject(MatDialog);

  private userToken: string = '';
  private reLoginSuccess: Subject<void> = new Subject<void>();

  /**
   * List of API endpoint paths that should be excluded from showing re-login
   * popup when response is 401 unauthorized.
   */
  private reqUrlsToExcludeFromReLogin = [
    'login',
    'logout',
    'reset-password',
    'change-password',
    'delete-me',
  ];

  constructor() {
    this.store.select(AuthSelectors.accessToken).subscribe((token?: string) => {
      this.userToken = token ?? '';
      if (this.userToken) this.reLoginSuccess.next();
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const reqAdditionalProps: any = {};

    // Add authorization header with access token.
    if (this.userToken?.length > 0)
      reqAdditionalProps.setHeaders = {
        Authorization: `Bearer ${this.userToken}`,
      };

    // Add additional properties to request.
    const req = request.clone(reqAdditionalProps);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const excludeFromReLogin = this.reqUrlsToExcludeFromReLogin.some(
          (pathToExclude) => req.url.indexOf(pathToExclude) !== -1,
        );
        if (
          !excludeFromReLogin &&
          error.status === HttpStatusCode.Unauthorized
        ) {
          const isReLoginDialogOpen = this.dialog.openDialogs.some(
            (d) => d.componentInstance instanceof ReLoginDialogComponent,
          );

          if (!isReLoginDialogOpen) {
            this.store.dispatch(AuthActions.removeAccessToken());
            this.dialog.open(ReLoginDialogComponent, { disableClose: true });
          }

          return this.reLoginSuccess.pipe(
            filter(() => !!this.userToken),
            take(1),
            switchMap(() =>
              next.handle(
                request.clone({
                  setHeaders: { Authorization: `Bearer ${this.userToken}` },
                }),
              ),
            ),
          );
        }

        console.error('Error intercepted: ', error);
        return throwError(() => error);
      }),
    );
  }
}
