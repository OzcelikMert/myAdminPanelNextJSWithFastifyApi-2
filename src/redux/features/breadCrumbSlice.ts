import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IBreadCrumbData {
  title: string;
  url?: string
}

export interface IBreadCrumbState {
  data: IBreadCrumbData[]
}

const initialState: IBreadCrumbState = {
  data: []
}

const breadCrumbSlice = createSlice({
  name: 'breadCrumbState',
  initialState,
  reducers: {
    setBreadCrumbState: (state, action: PayloadAction<IBreadCrumbState["data"]>) => {
      state.data = action.payload;
    }
  }
});

export const { setBreadCrumbState } = breadCrumbSlice.actions;

export const breadCrumbReducer = breadCrumbSlice.reducer;