import { TableColumn } from 'react-data-table-component';
import { IPostGetManyResultService } from 'types/services/post.service';
import { PostService } from '@services/post.service';
import { ViewService } from '@services/view.service';
import {
  IViewGetNumberResultService,
  IViewGetStatisticsResultService,
} from 'types/services/view.service';
import Image from 'next/image';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import { PostUtil } from '@utils/post.util';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { PostTypeId, postTypes } from '@constants/postTypes';
import { RouteUtil } from '@utils/route.util';
import { PostSortTypeId } from '@constants/postSortTypes';
import { ISettingGetResultService } from 'types/services/setting.service';
import { SettingService } from '@services/setting.service';
import { SettingProjectionKeys } from '@constants/settingProjections';
import React, { useEffect, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { useRouter } from 'next/router';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentPageDashboardLastPosts from '@components/pages/dashboard/lastPosts';
import ComponentPageDashboardReportOne from '@components/pages/dashboard/reportOne';
import ComponentPageDashboardReportTwo from '@components/pages/dashboard/reportTwo';
import ComponentThemeWebsiteLinkPost from '@components/theme/websiteLink/post';
import { IActionWithPayload } from 'types/hooks';
import { ApiEndPoints } from '@constants/apiEndPoints';
import { ApiResult } from '@library/api/result';

export type IPageDashboardState = {
  lastPosts: IPostGetManyResultService[];
  liveVisitorCount: number;
  viewsWithNumber: IViewGetNumberResultService;
  viewsWithStatistics: IViewGetStatisticsResultService;
  worldMapSize: 'lg' | 'xl' | 'xxl';
  settings: ISettingGetResultService;
};

const initialState: IPageDashboardState = {
  lastPosts: [],
  liveVisitorCount: 0,
  viewsWithNumber: {
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

enum ActionTypes {
  SET_LAST_POSTS,
  SET_LIVE_VISITOR_COUNT,
  SET_VIEWS_WITH_NUMBER,
  SET_VIEWS_WITH_STATISTICS,
  SET_WORLD_MAP_SIZE,
  SET_SETTINGS,
}

type IAction =
  | IActionWithPayload<
      ActionTypes.SET_LAST_POSTS,
      IPageDashboardState['lastPosts']
    >
  | IActionWithPayload<
      ActionTypes.SET_LIVE_VISITOR_COUNT,
      IPageDashboardState['liveVisitorCount']
    >
  | IActionWithPayload<
      ActionTypes.SET_VIEWS_WITH_NUMBER,
      IPageDashboardState['viewsWithNumber']
    >
  | IActionWithPayload<
      ActionTypes.SET_VIEWS_WITH_STATISTICS,
      IPageDashboardState['viewsWithStatistics']
    >
  | IActionWithPayload<
      ActionTypes.SET_WORLD_MAP_SIZE,
      IPageDashboardState['worldMapSize']
    >
  | IActionWithPayload<
      ActionTypes.SET_SETTINGS,
      IPageDashboardState['settings']
    >;

const reducer = (
  state: IPageDashboardState,
  action: IAction
): IPageDashboardState => {
  switch (action.type) {
    case ActionTypes.SET_LAST_POSTS:
      return { ...state, lastPosts: action.payload };
    case ActionTypes.SET_LIVE_VISITOR_COUNT:
      return { ...state, liveVisitorCount: action.payload };
    case ActionTypes.SET_VIEWS_WITH_NUMBER:
      return { ...state, viewsWithNumber: action.payload };
    case ActionTypes.SET_VIEWS_WITH_STATISTICS:
      return { ...state, viewsWithStatistics: action.payload };
    case ActionTypes.SET_WORLD_MAP_SIZE:
      return { ...state, worldMapSize: action.payload };
    case ActionTypes.SET_SETTINGS:
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};

export default function PageDashboard() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useDidMount(() => {
    init();

    return () => {
      abortControllerRef.current.abort();
    };
  });

  useEffectAfterDidMount(() => {
    if (isPageLoaded) {
      appDispatch(setIsPageLoadingState(false));
    }
  }, [isPageLoaded]);

  useEffect(() => {
    const ws = ViewService.webSocketOnlineUsers((event) => {
      const result: ApiResult<number> = JSON.parse(event.data);
      dispatch({
        type: ActionTypes.SET_LIVE_VISITOR_COUNT,
        payload: Number(result.data),
      });
    });
    return () => ws.close();
  }, []);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    setPageTitle();
    await getViewNumber();
    await getViewStatistics();
    await getSettings();
    await getLastPosts();
    setIsPageLoaded(true);
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
    const serviceResult = await ViewService.getNumber(
      abortControllerRef.current.signal
    );

    if (serviceResult.status && serviceResult.data) {
      if (
        JSON.stringify(state.viewsWithNumber) !=
        JSON.stringify(serviceResult.data)
      ) {
        dispatch({
          type: ActionTypes.SET_VIEWS_WITH_NUMBER,
          payload: serviceResult.data,
        });
      }
    }
  };

  const getViewStatistics = async () => {
    const serviceResult = await ViewService.getStatistics(
      abortControllerRef.current.signal
    );

    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: ActionTypes.SET_VIEWS_WITH_STATISTICS,
        payload: serviceResult.data,
      });
    }
  };

  const getSettings = async () => {
    const serviceResult = await SettingService.get(
      {
        projection: SettingProjectionKeys.General,
      },
      abortControllerRef.current.signal
    );

    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: ActionTypes.SET_SETTINGS,
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
        typeId: [
          PostTypeId.Page,
          PostTypeId.Blog,
          PostTypeId.BeforeAndAfter,
          PostTypeId.Portfolio,
          PostTypeId.Product,
          PostTypeId.Reference,
          PostTypeId.Service,
          PostTypeId.Slider,
          PostTypeId.Testimonial,
        ],
      },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: ActionTypes.SET_LAST_POSTS,
        payload: serviceResult.data,
      });
    }
  };

  const setWorldMapSize = (size: IPageDashboardState['worldMapSize']) => {
    dispatch({
      type: ActionTypes.SET_WORLD_MAP_SIZE,
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
    await RouteUtil.change({ path, router });
  };

  const getLastPostTableColumns = (): TableColumn<
    IPageDashboardState['lastPosts'][0]
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
        cell: (row) => (
          <ComponentThemeWebsiteLinkPost
            typeId={row.typeId}
            text={row.contents?.title || t('[noLangAdd]')}
            url={row.contents?.url}
          />
        ),
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
            name={row.lastAuthor?.name ?? ''}
            updatedAt={row.updatedAt || ''}
          />
        ),
      },
    ];
  };

  return isPageLoading ? null : (
    <div className="page-dashboard">
      <ComponentPageDashboardReportOne
        viewsWithNumber={state.viewsWithNumber}
        liveTotal={state.liveVisitorCount}
        googleAnalyticURL={state.settings.googleAnalyticURL}
      />
      <ComponentPageDashboardReportTwo
        viewsWithStatistics={state.viewsWithStatistics}
        worldMapSize={state.worldMapSize}
        setWorldMapSize={(size) => setWorldMapSize(size)}
      />
      <ComponentPageDashboardLastPosts
        columns={getLastPostTableColumns()}
        lastPosts={state.lastPosts}
      />
    </div>
  );
}
