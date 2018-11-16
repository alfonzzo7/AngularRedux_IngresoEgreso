import { ActionReducerMap } from '@ngrx/store';

import * as fromUI from './shared/ui.reducer';

export interface AppState {
    ui: fromUI.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    ui: fromUI.uiReducer
};
