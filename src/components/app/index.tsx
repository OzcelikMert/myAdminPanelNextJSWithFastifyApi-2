import React, { useEffect } from 'react';
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
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { setRouteState } from '@lib/features/routeSlice';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { setIsSessionAuthCheckedState } from '@lib/features/sessionSlice';

type IComponentProps = {
  children: React.ReactNode;
  statusCode?: number;
};

export default function ComponentProviderNoSSR({
  children,
  statusCode,
}: IComponentProps) {
  const appDispatch = useAppDispatch();
  const router = useRouter();
  const appState = useAppSelector((state) => state.appState);
  const breadCrumb = useAppSelector((state) => state.breadCrumbState.data);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const routeState = useAppSelector((state) => state.routeState);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (routeState.pathname !== url) {
        appDispatch(setIsPageLoadingState(true));
        appDispatch(setIsSessionAuthCheckedState(false));
        appDispatch(
          setRouteState({
            pathname: router.pathname,
            query: router.query,
          })
        );
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  if (router.asPath === '/' || typeof statusCode !== 'undefined') {
    router.replace(EndPoints.LOGIN);
    return null;
  }

  const getBreadcrumbTitle = () => {
    return breadCrumb.map((item) => item.title).join(' - ');
  };

  const PageHeader = () => {
    return (
      <div className="page-header">
        <div className="row w-100 m-0">
          <div className="col-md-8 p-0">
            <ComponentThemeBreadCrumb />
          </div>
        </div>
      </div>
    );
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
        <ComponentProviderAuth>
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
                  {!isFullPageLayout ? <PageHeader /> : null}
                  {children}
                </div>
                {!isFullPageLayout ? <ComponentToolFooter /> : null}
              </div>
            </div>
          </div>
        </ComponentProviderAuth>
      </ComponentProviderAppInit>
    </div>
  );
}
