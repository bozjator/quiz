import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from '../../auth/store/auth.reducer';
import { AuthEffects } from '../../auth/store/auth.effects';

/**
 * In how many minutes should cache expire.
 */
export const storeSectionExpires = {
  invoice: 15,
  activity: 10,
};

export const storeSectionName = {
  auth: 'auth',
};

export interface AppState {
  auth: AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};

export const appEffects = [
  AuthEffects, // Must be last, because will trigger initial data load.
];
