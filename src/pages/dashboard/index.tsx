import dynamic from 'next/dynamic';
import { TableColumn } from 'react-data-table-component';
import { IPostGetManyResultService } from 'types/services/post.service';
import { PostService } from '@services/post.service';
import { ViewService } from '@services/view.service';
import {
  IViewGetNumberResultService,
  IViewGetStatisticsResultService,
} from 'types/services/view.service';
import ComponentDataTable from '@components/elements/table/dataTable';
import Image from 'next/image';
import ComponentChartArea from '@components/elements/charts/area';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import { PostUtil } from '@utils/post.util';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { postTypes } from '@constants/postTypes';
import { RouteUtil } from '@utils/route.util';
import { PostSortTypeId } from '@constants/postSortTypes';
import { ISettingGetResultService } from 'types/services/setting.service';
import { SettingService } from '@services/setting.service';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { useEffect, useReducer } from 'react';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { useRouter } from 'next/router';
import { useDidMountHook } from '@library/react/customHooks';

const WorldMap = dynamic(() => import('react-svg-worldmap'), { ssr: false });

type IComponentState = {
  lastPosts: IPostGetManyResultService[];
  viewsWithNumber: IViewGetNumberResultService;
  viewsWithStatistics: IViewGetStatisticsResultService;
  worldMapSize: 'lg' | 'xl' | 'xxl';
  settings: ISettingGetResultService;
};

const initialState: IComponentState = {
  lastPosts: [],
  viewsWithNumber: {
    liveTotal: 0,
    averageTotal: 0,
    weeklyTotal: 0,
  },
  viewsWithStatistics: {
    day: [],
    country: [],
  },
  worldMapSize: 'lg',
  settings: {},
};

type IAction =
  | { type: 'SET_LAST_POSTS'; payload: IComponentState['lastPosts'] }
  | {
      type: 'SET_VIEWS_WITH_NUMBER';
      payload: IComponentState['viewsWithNumber'];
    }
  | {
      type: 'SET_VIEWS_WITH_STATISTICS';
      payload: IComponentState['viewsWithStatistics'];
    }
  | { type: 'SET_WORLD_MAP_SIZE'; payload: IComponentState['worldMapSize'] }
  | { type: 'SET_SETTINGS'; payload: IComponentState['settings'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_LAST_POSTS':
      return { ...state, lastPosts: action.payload };
    case 'SET_VIEWS_WITH_NUMBER':
      return { ...state, viewsWithNumber: action.payload };
    case 'SET_VIEWS_WITH_STATISTICS':
      return { ...state, viewsWithStatistics: action.payload };
    case 'SET_WORLD_MAP_SIZE':
      return { ...state, worldMapSize: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

export default function PageDashboard() {
  let timer: NodeJS.Timeout | null = null;
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);

  useDidMountHook(() => {
    init();
    return () => {
      if (timer) {
        clearInterval(timer);
      }
      abortController.abort();
    };
  });

  const init = async () => {
    setPageTitle();
    await getViewNumber();
    await getViewStatistics();
    await getSettings();
    await getLastPosts();
    appDispatch(setIsPageLoadingState(false));
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('dashboard'),
        },
      ])
    );
  };

  const getViewNumber = async () => {
    const serviceResult = await ViewService.getNumber(abortController.signal);

    if (serviceResult.status && serviceResult.data) {
      if (
        JSON.stringify(state.viewsWithNumber) !=
        JSON.stringify(serviceResult.data)
      ) {
        dispatch({
          type: 'SET_VIEWS_WITH_NUMBER',
          payload: serviceResult.data,
        });
      }
    }
  };

  const getViewStatistics = async () => {
    const serviceResult = await ViewService.getStatistics(
      abortController.signal
    );

    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: 'SET_VIEWS_WITH_STATISTICS',
        payload: serviceResult.data,
      });
    }
  };

  const getSettings = async () => {
    const serviceResult = await SettingService.get(
      {
        projection: SettingProjectionKeys.General,
      },
      abortController.signal
    );

    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: 'SET_SETTINGS',
        payload: serviceResult.data,
      });
    }
  };

  const getLastPosts = async () => {
    const serviceResult = await PostService.getMany(
      {
        langId: mainLangId,
        count: 10,
        sortTypeId: PostSortTypeId.Newest,
      },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: 'SET_LAST_POSTS',
        payload: serviceResult.data,
      });
    }
  };

  const setWorldMapSize = (size: IComponentState['worldMapSize']) => {
    dispatch({
      type: 'SET_WORLD_MAP_SIZE',
      payload: size,
    });
  };

  const navigatePostPage = async (
    type: 'termEdit' | 'edit' | 'listPost',
    postTypeId: number,
    itemId = '',
    termTypeId = 0
  ) => {
    const pagePath = PostUtil.getPagePath(postTypeId);
    let path = '';
    switch (type) {
      case 'edit':
        path = pagePath.EDIT(itemId);
        break;
      case 'termEdit':
        path = pagePath.TERM_WITH(termTypeId).EDIT(itemId);
        break;
      case 'listPost':
        path = pagePath.LIST;
        break;
    }
    await RouteUtil.change({ path, router, appDispatch });
  };

  const getLastPostTableColumns = (): TableColumn<
    IComponentState['lastPosts'][0]
  >[] => {
    return [
      {
        name: t('image'),
        width: '105px',
        cell: (row) => (
          <div className="image pt-2 pb-2">
            <Image
              src={ImageSourceUtil.getUploadedImageSrc(row.contents?.image)}
              alt={row.contents?.title ?? ''}
              width={75}
              height={75}
              className="post-image img-fluid"
            />
          </div>
        ),
      },
      {
        name: t('title'),
        selector: (row) => row.contents?.title || t('[noLangAdd]'),
        sortable: true,
      },
      {
        name: t('type'),
        selector: (row) => row.typeId,
        sortable: true,
        cell: (row) => (
          <label
            onClick={() => navigatePostPage('listPost', row.typeId, row._id)}
            className={`badge badge-gradient-primary cursor-pointer`}
          >
            {t(
              postTypes.findSingle('id', row.typeId)?.langKey ?? '[noLangAdd]'
            )}
          </label>
        ),
      },
      {
        name: t('status'),
        selector: (row) => row.statusId,
        sortable: true,
        cell: (row) => <ComponentThemeBadgeStatus statusId={row.statusId} />,
      },
      {
        name: t('updatedBy'),
        sortable: true,
        cell: (row) => (
          <ComponentTableUpdatedBy
            name={row.lastAuthorId.name}
            updatedAt={row.updatedAt || ''}
          />
        ),
      },
    ];
  };

  const Reports = () => {
    return (
      <div className="col-12 grid-margin">
        <div className="card card-statistics">
          <div className="row">
            <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="mdi mdi-account-multiple-outline text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">
                      {t('currentVisitors')}
                    </p>
                    <div className="fluid-container">
                      <h3 className="mb-0 font-weight-medium text-dark">
                        {state.viewsWithNumber.liveTotal}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="mdi mdi-target text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">
                      {t('dailyAverageVisitors')}
                    </p>
                    <div className="fluid-container">
                      <h3 className="mb-0 font-weight-medium text-dark">
                        {state.viewsWithNumber.averageTotal}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="mdi mdi-calendar-week text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">
                      {t('weeklyTotalVisitors')}
                    </p>
                    <div className="fluid-container">
                      <h3 className="mb-0 font-weight-medium text-dark">
                        {state.viewsWithNumber.weeklyTotal}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="mdi mdi-google-analytics text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">
                      {t('lifeTimeVisitors')}
                    </p>
                    <div className="fluid-container">
                      <h3 className="mb-0 font-weight-medium text-dark">
                        <a
                          target="_blank"
                          className="text-info fs-6 text-decoration-none"
                          href={
                            state.settings.googleAnalyticURL ??
                            'javascript:void(0);'
                          }
                        >
                          {t('clickToSee')}
                        </a>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReportTwo = () => {
    return (
      <div className="row">
        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix mb-4">
                <h4 className="card-title float-start">
                  {t('weeklyVisitorsStatistics')}
                </h4>
              </div>
              <div className="chart-container">
                <ComponentChartArea
                  toolTipLabel={t('visitors')}
                  data={state.viewsWithStatistics.day.map((view) => view.total)}
                  labels={state.viewsWithStatistics.day.map((view) => view._id)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body overflow-auto">
              <h4 className="card-title">
                {t('weeklyVisitorsStatistics')} ({t('worldMap')})
              </h4>
              <div className="row d-none d-lg-block">
                <div className="col-md-12 text-end">
                  <button
                    className="btn btn-gradient-success btn-sm"
                    onClick={() =>
                      setWorldMapSize(state.worldMapSize == 'xl' ? 'xxl' : 'xl')
                    }
                  >
                    <i className="fa fa-search-plus"></i>
                  </button>
                  <button
                    className="btn btn-gradient-danger btn-sm"
                    onClick={() =>
                      setWorldMapSize(state.worldMapSize == 'xxl' ? 'xl' : 'lg')
                    }
                  >
                    <i className="fa fa-search-minus"></i>
                  </button>
                </div>
              </div>
              <div className="row overflow-auto">
                <WorldMap
                  color="#b66dff"
                  borderColor="var(--theme-worldmap-stroke-bg)"
                  frameColor="red"
                  strokeOpacity={0.4}
                  backgroundColor="var(--theme-bg)"
                  value-suffix="people"
                  size={state.worldMapSize}
                  data={state.viewsWithStatistics.country.map((view) => ({
                    country: (
                      view._id || window.navigator.language.slice(3)
                    ).toLowerCase(),
                    value: view.total,
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LastPost = () => {
    return (
      <div className="row page-post">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{t('lastPosts')}</h4>
              <div className="table-post">
                <ComponentDataTable
                  columns={getLastPostTableColumns()}
                  data={state.lastPosts}
                  i18={{
                    search: t('search'),
                    noRecords: t('noRecords'),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return isPageLoading ? null : (
    <div className="page-dashboard">
      {Reports()}
      {ReportTwo()}
      {LastPost()}
    </div>
  );
}
