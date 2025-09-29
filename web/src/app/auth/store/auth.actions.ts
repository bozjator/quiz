import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginCredentials, LoginResponse, User } from '../models/auth.models';

const login = createAction('[Auth] Login', props<{ payload: LoginCredentials }>());
const loginSuccess = createAction('[Auth] Login Success', props<{ payload: LoginResponse }>());
const loginFailure = createAction('[Auth] Login Failure', props<{ payload: HttpErrorResponse }>());

const logout = createAction('[Auth] Logout');
const logoutSuccess = createAction('[Auth] Logout Success');
const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ payload: HttpErrorResponse }>(),
);

const loadUser = createAction('[Auth] Load User');
const loadUserSuccess = createAction('[Auth] Load User Success', props<{ payload: User }>());
const loadUserFailure = createAction(
  '[Auth] Load User Failure',
  props<{ payload: HttpErrorResponse }>(),
);

const removeAccessToken = createAction('[Auth] Remove Access Token');

const AuthActions = {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  logoutFailure,
  loadUser,
  loadUserSuccess,
  loadUserFailure,
  removeAccessToken,
};
export { AuthActions };
