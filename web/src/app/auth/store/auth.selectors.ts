import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { storeSectionName } from '../../shared/store/app-store';

const authState = createFeatureSelector<AuthState>(storeSectionName.auth);

const loginFailureError = createSelector(authState, (auth) => auth.errorLogin);
const isLoggedIn = createSelector(authState, (auth) => !!auth.accessToken);
const loggedInUser = createSelector(authState, (auth) => auth.user);
const accessToken = createSelector(authState, (auth) => auth.accessToken);

const AuthSelectors = {
  loginFailureError,
  isLoggedIn,
  loggedInUser,
  accessToken,
};
export { AuthSelectors };
