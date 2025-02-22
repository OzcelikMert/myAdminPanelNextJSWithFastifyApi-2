import { AuthService } from '@services/auth.service';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { EndPoints } from '@constants/endPoints';
import { RouteUtil } from '@utils/route.util';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import React, { useState } from 'react';
import { setSessionAuthState } from '@redux/features/sessionSlice';
import { useRouter } from 'next/router';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { SessionUtil } from '@utils/session.util';

type IComponentState = {
  isAuth: boolean;
  isLoading: boolean;
  isChecked: boolean;
};

const initialState: IComponentState = {
  isAuth: false,
  isLoading: true,
  isChecked: false,
};

enum ActionTypes {
  SET_IS_AUTH,
  SET_IS_LOADING,
  SET_IS_CHECKED,
}

type IAction =
  | { type: ActionTypes.SET_IS_AUTH; payload: IComponentState['isAuth'] }
  | { type: ActionTypes.SET_IS_LOADING; payload: IComponentState['isLoading'] }
  | { type: ActionTypes.SET_IS_CHECKED; payload: IComponentState['isChecked'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_IS_AUTH:
      return {
        ...state,
        isAuth: action.payload,
      };
    case ActionTypes.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ActionTypes.SET_IS_CHECKED:
      return {
        ...state,
        isChecked: action.payload,
      };
    default:
      return state;
  }
};

type IComponentProps = {
  children: React.ReactNode;
};

const ComponentProviderAuth = (props: IComponentProps) => {
  const abortControllerRef = React.useRef(new AbortController());

  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isAppLock = useAppSelector((state) => state.appState.isLock);
  const router = useRouter();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  useDidMount(() => {
    init();
    return () => {
      abortControllerRef.current.abort();
    };
  });

  useEffectAfterDidMount(() => {
    if (state.isChecked) {
      dispatch({ type: ActionTypes.SET_IS_LOADING, payload: false });
    }
  }, [state.isChecked]);

  const init = async () => {
    if (!state.isLoading) {
      dispatch({ type: ActionTypes.SET_IS_LOADING, payload: true });
    }
    await checkSession();
  };

  const checkSession = async () => {
    if (state.isChecked) {
      dispatch({ type: ActionTypes.SET_IS_CHECKED, payload: false });
    }

    const serviceResult = await AuthService.getSession(
      abortControllerRef.current.signal
    );

    if (
      serviceResult.status &&
      serviceResult.errorCode == ApiErrorCodes.success
    ) {
      if (serviceResult.data) {
        const newSessionAuth = SessionUtil.getSessionAuthData(
          serviceResult.data
        );
        if (
          !sessionAuth ||
          JSON.stringify(newSessionAuth) != JSON.stringify(sessionAuth)
        ) {
          appDispatch(setSessionAuthState(serviceResult.data));
        }
        dispatch({ type: ActionTypes.SET_IS_AUTH, payload: true });
      }
    } else {
      dispatch({ type: ActionTypes.SET_IS_AUTH, payload: false });
    }

    dispatch({ type: ActionTypes.SET_IS_CHECKED, payload: true });
  };

  if (!state.isChecked) {
    return null;
  }

  if (state.isLoading || abortControllerRef.current.signal.aborted) {
    return null;
  }

  if (
    !state.isAuth &&
    !isAppLock &&
    ![EndPoints.LOGIN].includes(router.pathname)
  ) {
    RouteUtil.change({
      router,
      path: EndPoints.LOGIN,
    });
    return null;
  }

  if (state.isAuth && [EndPoints.LOGIN].includes(router.pathname)) {
    RouteUtil.change({
      router,
      path: EndPoints.DASHBOARD,
    });
    return null;
  }

  return props.children;
};

export default ComponentProviderAuth;
