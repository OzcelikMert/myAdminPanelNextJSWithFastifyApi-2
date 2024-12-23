import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IRouterState {
  isChanged: boolean;
  pathname: string;
  query: Record<string, any>;
}

const initialState: IRouterState = {
  isChanged: false,
  pathname: '',
  query: {},
};

const routerSlice = createSlice({
  name: 'routerState',
  initialState,
  reducers: {
    setRouterState: (state, action: PayloadAction<IRouterState>) => {
      state.pathname = action.payload.pathname;
      state.query = action.payload.query;
    },
  },
});

export const { setRouterState } = routerSlice.actions;

export const routerReducer = routerSlice.reducer;
