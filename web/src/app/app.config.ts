import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthHttpInterceptor } from './auth/auth-http.interceptor';

import { routes } from './app.routes';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducers, appEffects } from './shared/store/app-store';
import { metaReducers } from './shared/store/meta.reducer';

const storeConfig = [
  provideStore(appReducers, { metaReducers }),
  provideEffects(appEffects),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    ...storeConfig,
  ],
};

export const INPUT_LENGTHS = {
  min: {
    password: 8,
    question: 10,
    answer: 1,
  },
  max: {
    password: 50,
    firstName: 50,
    lastName: 50,
    email: 100,
  },
};
