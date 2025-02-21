import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAppState {
  isLoading: boolean;
  isLock: boolean;
}

const initialState: IAppState = {
  isLoading: true,
  isLock: false,
};

const appSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setIsAppLoadingState(state, action: PayloadAction<IAppState['isLoading']>) {
      state.isLoading = action.payload;
    },
    setIsLockState(state, action: PayloadAction<IAppState['isLock']>) {
      state.isLock = action.payload;
    },
  },
});

export const { setIsAppLoadingState, setIsLockState } = appSlice.actions;
export const appReducer = appSlice.reducer;
