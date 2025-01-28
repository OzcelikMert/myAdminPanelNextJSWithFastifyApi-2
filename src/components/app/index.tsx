import React, { useRef } from 'react';
import ComponentToolNavbar from '@components/tools/navbar';
import ComponentToolSidebar from '@components/tools/sidebar';
import ComponentToolFooter from '@components/tools/footer';
import ComponentThemeBreadCrumb from '@components/theme/breadCrumb';
import ComponentHead from '@components/head';
import ComponentProviderAuth from '@components/providers/auth';
import ComponentProviderAppInit from '@components/providers/appInit';
import { ToastContainer } from 'react-toastify';
import { EndPoints } from '@constants/endPoints';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import ComponentToolLock from '@components/tools/lock';
import { NextRouter, useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useEffectAfterDidMount } from '@library/react/hooks';
import ComponentToolHeader from '@components/tools/header';

type ICurrentPath = {
  pathname: string;
  query?: any;
};

const checkEqualRouterAndCurrentPath = (
  router: NextRouter,
  currentPath: ICurrentPath
) => {
  const jsonCurrentPath = JSON.stringify(currentPath);
  const jsonRouter = JSON.stringify({
    pathname: router.pathname,
    query: router.query,
  } as ICurrentPath);
  return jsonCurrentPath == jsonRouter;
};

type IComponentProps = {
  children: React.ReactNode;
  statusCode?: number;
};

const ComponentApp = React.memo((props: IComponentProps) => {
  const appDispatch = useAppDispatch();
  const router = useRouter();
  const appState = useAppSelector((state) => state.appState);
  const breadCrumb = useAppSelector((state) => state.breadCrumbState.data);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const currentPathRef = useRef<ICurrentPath>({
    pathname: router.pathname,
    query: router.query,
  });
  const isEqualRouterAndCurrentPath = checkEqualRouterAndCurrentPath(
    router,
    currentPathRef.current
  );

  useEffectAfterDidMount(() => {
    if (!isEqualRouterAndCurrentPath) {
      appDispatch(setIsPageLoadingState(true));
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      currentPathRef.current = {
        pathname: router.pathname,
        query: router.query,
      };
    }
  }, [isEqualRouterAndCurrentPath]);

  if (router.asPath === '/' || typeof props.statusCode !== 'undefined') {
    router.replace(EndPoints.LOGIN);
    return null;
  }

  const getBreadcrumbTitle = () => {
    return breadCrumb.map((item) => item.title).join(' - ');
  };

  const fullPageLayoutRoutes = [EndPoints.LOGIN];

  const isFullPageLayout =
    fullPageLayoutRoutes.includes(router.pathname) ||
    appState.isLock ||
    appState.isLoading;

  return (
    <div>
      <ComponentHead title={getBreadcrumbTitle()} />
      {appState.isLoading ? (
        <ComponentSpinnerDonut customClass="app-spinner" />
      ) : null}
      <ComponentProviderAppInit>
        <div className="container-scroller">
          {appState.isLock ? <ComponentToolLock /> : null}
          <ToastContainer />
          {!isFullPageLayout ? <ComponentToolNavbar /> : null}
          <div
            className={`container-fluid page-body-wrapper ${isFullPageLayout ? 'full-page-wrapper' : ''}`}
          >
            {!isFullPageLayout ? <ComponentToolSidebar /> : null}
            <div className="main-panel">
              <div className="content-wrapper">
                {isPageLoading ? (
                  <ComponentSpinnerDonut customClass="page-spinner" />
                ) : null}
                {!isFullPageLayout ? <ComponentToolHeader /> : null}
                {isEqualRouterAndCurrentPath ? (
                  <ComponentProviderAuth>
                    {props.children}
                  </ComponentProviderAuth>
                ) : null}
              </div>
              {!isFullPageLayout ? <ComponentToolFooter /> : null}
            </div>
          </div>
        </div>
      </ComponentProviderAppInit>
    </div>
  );
});

export default ComponentApp;
