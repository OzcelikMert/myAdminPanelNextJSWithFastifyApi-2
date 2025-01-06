import { AuthService } from '@services/auth.service';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { EndPoints } from '@constants/endPoints';
import { RouteUtil } from '@utils/route.util';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { useState } from 'react';
import {
  setSessionAuthState,
} from '@lib/features/sessionSlice';
import { useRouter } from 'next/router';
import { useDidMountHook } from '@library/react/customHooks';

type IComponentState = {
  isAuth: boolean;
  isLoading: boolean;
};

const initialState: IComponentState = {
  isAuth: false,
  isLoading: true,
};

type IComponentProps = {
  children: React.ReactNode;
};

export default function ComponentProviderAuth({ children }: IComponentProps) {
  const abortController = new AbortController();

  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isAppLock = useAppSelector((state) => state.appState.isLock);
  const router = useRouter();

  const [isAuth, setIsAuth] = useState(initialState.isAuth);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);

  useDidMountHook(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  const init = async () => {
    if (!isLoading) {
      setIsLoading(true);
    }
    await checkSession();
    setIsLoading(false);
  };

  const checkSession = async () => {
    const serviceResult = await AuthService.getSession(abortController.signal);

    if (
      serviceResult.status &&
      serviceResult.errorCode == ApiErrorCodes.success
    ) {
      if (serviceResult.data) {
        setIsAuth(true);
        if (JSON.stringify(serviceResult.data) != JSON.stringify(sessionAuth)) {
          appDispatch(setSessionAuthState(serviceResult.data));
        }
      }
    } else {
      setIsAuth(false);
    }
  };

  if (isLoading || abortController.signal.aborted) {
    return null;
  }

  if (!isAuth && !isAppLock && ![EndPoints.LOGIN].includes(router.pathname)) {
    RouteUtil.change({
      router: router,
      appDispatch: appDispatch,
      path: EndPoints.LOGIN,
    });
    return null;
  }

  if (isAuth && [EndPoints.LOGIN].includes(router.pathname)) {
    RouteUtil.change({
      router: router,
      appDispatch: appDispatch,
      path: EndPoints.DASHBOARD,
    });
    return null;
  }

  return children;
}
