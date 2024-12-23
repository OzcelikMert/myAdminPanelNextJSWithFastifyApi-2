import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IPageState = {
  isLoading: boolean;
};

const initialState: IPageState = {
  isLoading: true,
};

const pageSlice = createSlice({
  name: 'pageState',
  initialState,
  reducers: {
    setIsPageLoadingState(state, action: PayloadAction<IPageState['isLoading']>) {
      state.isLoading = action.payload;
    }
  },
});

export const {
  setIsPageLoadingState
} = pageSlice.actions;
export const pageReducer = pageSlice.reducer;
