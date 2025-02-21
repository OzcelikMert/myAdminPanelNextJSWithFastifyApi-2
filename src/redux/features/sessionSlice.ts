import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISessionAuthResultService } from 'types/services/auth.service';

export interface ISessionState {
  auth: ISessionAuthResultService | null;
  isAuthChecked: boolean;
}

const initialState: ISessionState = {
  auth: null,
  isAuthChecked: false,
};

const sessionSlice = createSlice({
  name: 'sessionState',
  initialState,
  reducers: {
    setSessionAuthState: (
      state,
      action: PayloadAction<ISessionState['auth']>
    ) => {
      state.auth = action.payload;
    },
    setIsSessionAuthCheckedState: (
      state,
      action: PayloadAction<ISessionState['isAuthChecked']>
    ) => {
      state.isAuthChecked = action.payload;
    },
  },
});

export const { setSessionAuthState, setIsSessionAuthCheckedState } =
  sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;
