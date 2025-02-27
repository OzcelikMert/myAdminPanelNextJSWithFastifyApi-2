import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { appReducer } from './features/appSlice';
import { pageReducer } from './features/pageSlice';
import { settingReducer } from './features/settingSlice';
import { sessionReducer } from './features/sessionSlice';
import { translationReducer } from './features/translationSlice';
import { breadCrumbReducer } from './features/breadCrumbSlice';
import { routeReducer } from './features/routeSlice';

const isProduction = process.env.RUN_TYPE === 'production';
export const makeStore = () =>
  configureStore({
    reducer: {
      appState: appReducer,
      pageState: pageReducer,
      settingState: settingReducer,
      sessionState: sessionReducer,
      translationState: translationReducer,
      breadCrumbState: breadCrumbReducer,
      routeState: routeReducer,
    },
    devTools: !isProduction,
    middleware: (gDM) => (isProduction ? gDM().concat(logger) : gDM()),
  });

export type IAppStore = ReturnType<typeof makeStore>;
export type IRootState = ReturnType<IAppStore['getState']>;
export type IAppDispatch = IAppStore['dispatch'];
