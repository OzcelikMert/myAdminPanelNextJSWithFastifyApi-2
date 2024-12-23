import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IPageState = {
  isLoading: boolean;
  currentLangId: string;
};

const initialState: IPageState = {
  isLoading: true,
  currentLangId: '',
};

const pageSlice = createSlice({
  name: 'pageState',
  initialState,
  reducers: {
    setIsPageLoadingState(state, action: PayloadAction<IPageState['isLoading']>) {
      state.isLoading = action.payload;
    },
    setCurrentLangIdState(state, action: PayloadAction<IPageState['currentLangId']>) {
      state.currentLangId = action.payload;
    }
  },
});

export const {
  setIsPageLoadingState,
  setCurrentLangIdState
} = pageSlice.actions;
export const pageReducer = pageSlice.reducer;
