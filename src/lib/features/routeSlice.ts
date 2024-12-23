import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IRouteState {
  pathname: string;
  query: Record<string, any>;
}

const initialState: IRouteState = {
  pathname: '',
  query: {},
};

const routeSlice = createSlice({
  name: 'routeState',
  initialState,
  reducers: {
    setRouteState: (state, action: PayloadAction<IRouteState>) => {
      state.pathname = action.payload.pathname;
      state.query = action.payload.query;
    },
  },
});

export const { setRouteState } = routeSlice.actions;

export const routeReducer = routeSlice.reducer;
