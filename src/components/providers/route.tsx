import ComponentError404 from '@components/errors/404';
import { EndPoints } from '@constants/endPoints';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { RouteUtil } from '@utils/route.util';
import { useRouter } from 'next/router';
import React from 'react';

type IComponentProps = {
  children: React.ReactNode;
  statusCode?: number;
};

const ComponentProviderRoute = (props: IComponentProps) => {
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  useDidMount(() => {
    checkStatusCode();
  });

  useEffectAfterDidMount(() => {
    checkStatusCode();
  }, [props.statusCode]);

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: props.statusCode?.toString() ?? '',
        },
      ])
    );
  };

  const checkStatusCode = () => {
    if (props.statusCode) {
      setPageTitle();
      if (isPageLoading) {
        appDispatch(setIsPageLoadingState(false));
      }
    }
  };

  if (router.asPath === '/') {
    RouteUtil.change({
      router,
      path: EndPoints.DASHBOARD,
    });
    return null;
  }

  if (props.statusCode) {
    let component = null;

    switch (props.statusCode) {
      case ApiStatusCodes.notFound:
        component = <ComponentError404 />;
        break;
    }

    return <div className="page-error">{component}</div>;
  }

  return props.children;
};

export default ComponentProviderRoute;
