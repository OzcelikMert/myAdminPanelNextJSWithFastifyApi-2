import React, { useRef } from 'react';
import ComponentToolNavbar from '@components/tools/navbar';
import ComponentToolSidebar from '@components/tools/sidebar';
import ComponentToolFooter from '@components/tools/footer';
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
import ComponentProviderRoute from '@components/providers/route';

type ICurrentPath = {
  pathname: string;
  query?: any;
};

const checkRouterAndCurrentPathIsEqual = (
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

type IComponentState = {
  currentPath: ICurrentPath;
};

const initialState: IComponentState = {
  currentPath: {
    pathname: '',
    query: {},
  },
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

  const [currentPath, setCurrentPath] = React.useState<
    IComponentState['currentPath']
  >({
    ...initialState.currentPath,
    pathname: router.pathname,
    query: router.query,
  });

  useEffectAfterDidMount(() => {
    const isEqualRouterAndCurrentPath = checkRouterAndCurrentPathIsEqual(
      router,
      currentPath
    );

    if (!isEqualRouterAndCurrentPath) {
      appDispatch(setIsPageLoadingState(true));
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      setCurrentPath({
        pathname: router.pathname,
        query: router.query,
      });
    }
  }, [router]);

  const getBreadcrumbTitle = () => {
    return breadCrumb.map((item) => item.title).join(' - ');
  };

  const fullPageLayoutRoutes = [EndPoints.LOGIN];

  const isFullPageLayout =
    fullPageLayoutRoutes.includes(router.pathname) ||
    appState.isLock ||
    appState.isLoading;

  const isPageChanged = !checkRouterAndCurrentPathIsEqual(router, currentPath);

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
                {!isPageChanged ? (
                  <ComponentProviderAuth>
                    <ComponentProviderRoute statusCode={props.statusCode}>
                      {props.children}
                    </ComponentProviderRoute>
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
