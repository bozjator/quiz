import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import { User } from '../models/auth.models';
import { AuthActions } from './auth.actions';

export interface AuthState {
  accessToken?: string;
  user?: User;
  errorLogin?: HttpErrorResponse;
  errorLogout?: HttpErrorResponse;
  errorLoadUser?: HttpErrorResponse;
}

const initialState: AuthState = {
  accessToken: undefined,
  user: undefined,
  errorLogin: undefined,
  errorLogout: undefined,
  errorLoadUser: undefined,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.loginSuccess, (state, action): AuthState => {
    return {
      ...initialState,
      accessToken: action.payload.accessToken,
      user: action.payload.user,
    };
  }),

  on(AuthActions.loginFailure, (state, action): AuthState => {
    return {
      ...initialState,
      errorLogin: action.payload,
    };
  }),

  on(AuthActions.logoutSuccess, (state, action): AuthState => {
    return { ...initialState };
  }),

  on(AuthActions.logoutFailure, (state, action): AuthState => {
    return {
      ...initialState,
      errorLogout: action.payload,
    };
  }),

  on(AuthActions.loadUserSuccess, (state, action): AuthState => {
    return {
      ...state,
      user: action.payload,
    };
  }),

  on(AuthActions.loadUserFailure, (state, action): AuthState => {
    return {
      ...state,
      errorLoadUser: action.payload,
    };
  }),

  on(AuthActions.removeAccessToken, (state, action): AuthState => {
    return {
      ...state,
      accessToken: undefined,
    };
  }),
);
