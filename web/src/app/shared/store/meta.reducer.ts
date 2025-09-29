import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthActions } from '../../auth/store/auth.actions';

export function clearAppState(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === AuthActions.logoutSuccess.type) state = undefined;
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [clearAppState];
