import { TableColumn } from 'react-data-table-component';
import ComponentDataTable, {
  IComponentDataTableColumn,
} from '@components/elements/table/dataTable';
import { ILanguageGetResultService } from 'types/services/language.service';
import { LanguageService } from '@services/language.service';
import Image from 'next/image';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentThemeModalUpdateItemRank from '@components/theme/modal/updateItemRank';
import { PermissionUtil } from '@utils/permission.util';
import { LanguageEndPointPermission } from '@constants/endPointPermissions/language.endPoint.permission';
import { EndPoints } from '@constants/endPoints';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { RouteUtil } from '@utils/route.util';
import React, { use, useEffect, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useRouter } from 'next/router';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { SortUtil } from '@utils/sort.util';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

type IPageState = {
  items: ILanguageGetResultService[];
  selectedItemId: string;
  isShowModalUpdateRank: boolean;
};

const initialState: IPageState = {
  items: [],
  selectedItemId: '',
  isShowModalUpdateRank: false,
};

enum ActionTypes {
  SET_ITEMS,
  SET_SELECTED_ITEM_ID,
  SET_IS_SHOW_MODAL_UPDATE_RANK,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_ITEMS, IPageState['items']>
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ITEM_ID,
      IPageState['selectedItemId']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
      IPageState['isShowModalUpdateRank']
    >;

const reducer = (state: IPageState, action: IAction): IPageState => {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_SELECTED_ITEM_ID:
      return { ...state, selectedItemId: action.payload };
    case ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK:
      return { ...state, isShowModalUpdateRank: action.payload };
    default:
      return state;
  }
};

export default function PageSettingLanguageList() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { showToast } = useToast();
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

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    if (
      await PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission: LanguageEndPointPermission.GET,
        showToast,
      })
    ) {
      setPageTitle();
      await getItems();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([{ title: t('languages') }, { title: t('list') }])
    );
  };

  const getItems = async () => {
    const result = await LanguageService.getMany(
      {},
      abortControllerRef.current.signal
    );

    if (result.status && result.data) {
      dispatch({ type: ActionTypes.SET_ITEMS, payload: result.data });
    }
  };

  const onChangeRank = async (rank: number) => {
    const serviceResult = await LanguageService.updateRankWithId(
      {
        _id: state.selectedItemId,
        rank: rank,
      },
      abortControllerRef.current.signal
    );

    if (serviceResult.status) {
      const newItems = state.items;
      const newItem = newItems.findSingle('_id', state.selectedItemId);
      if (newItem) {
        newItem.rank = rank;
      }
      dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
      showToast({
        type: 'success',
        title: t('successful'),
        content: `'${newItem?.title}' ${t('itemEdited')}`,
        timeOut: 3,
      });
      return true;
    }
  };

  const navigatePage = (type: 'edit', itemId = '') => {
    const path = EndPoints.LANGUAGE_WITH;
    switch (type) {
      case 'edit':
        RouteUtil.change({ router, path: path.EDIT(itemId) });
        break;
    }
  };

  const getTableColumns = (): IComponentDataTableColumn<
    IPageState['items'][0]
  >[] => {
    return [
      {
        name: t('image'),
        width: '105px',
        cell: (row) => (
          <div className="image mt-2 mb-2">
            <Image
              src={ImageSourceUtil.getUploadedFlagSrc(row.image)}
              alt={row.title}
              width={75}
              height={75}
              className="img-fluid"
            />
          </div>
        ),
      },
      {
        name: t('title'),
        selector: (row) => row.title,
        cell: (row) => (
          <div className="row w-100">
            <div className="col-md-12">
              {row.title} ({row.shortKey}-{row.locale})
            </div>
          </div>
        ),
        width: '250px',
        sortable: true,
        isSearchable: true,
      },
      {
        name: t('status'),
        sortable: true,
        selector: (row) => row.statusId,
        cell: (row) => <ComponentThemeBadgeStatus statusId={row.statusId} />,
      },
      {
        name: t('rank'),
        sortable: true,
        selector: (row) => row.rank ?? 0,
        cell: (row) => {
          return PermissionUtil.check(
            sessionAuth!,
            LanguageEndPointPermission.UPDATE
          ) ? (
            <span
              className="cursor-pointer"
              onClick={() => {
                dispatch({
                  type: ActionTypes.SET_SELECTED_ITEM_ID,
                  payload: row._id,
                });
                dispatch({
                  type: ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
                  payload: true,
                });
              }}
            >
              {row.rank ?? 0} <i className="fa fa-pencil-square-o"></i>
            </span>
          ) : (
            <span>{row.rank ?? 0}</span>
          );
        },
      },
      {
        name: t('default'),
        cell: (row) => {
          return row.isDefault ? (
            <span className="text-success fs-5">
              <i className="mdi mdi-check-circle"></i>
            </span>
          ) : (
            <span className="text-danger fs-5">
              <i className="mdi mdi-minus-circle"></i>
            </span>
          );
        },
      },
      {
        name: t('createdDate'),
        sortable: true,
        selector: (row) => new Date(row.createdAt || '').toLocaleDateString(),
        sortFunction: (a, b) => SortUtil.sortByDate(a.createdAt, b.createdAt),
      },
      PermissionUtil.check(sessionAuth!, LanguageEndPointPermission.UPDATE)
        ? {
            name: '',
            width: '70px',
            button: true,
            cell: (row) => (
              <button
                onClick={() => navigatePage('edit', row._id)}
                className="btn btn-gradient-warning"
              >
                <i className="fa fa-pencil-square-o"></i>
              </button>
            ),
          }
        : {},
    ];
  };

  const selectedItem = state.items.findSingle('_id', state.selectedItemId);

  return isPageLoading ? null : (
    <div className="page-post">
      <ComponentThemeModalUpdateItemRank
        isShow={state.isShowModalUpdateRank}
        onHide={() =>
          dispatch({
            type: ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
            payload: false,
          })
        }
        onSubmit={(rank) => onChangeRank(rank)}
        rank={selectedItem?.rank}
        title={selectedItem?.title}
      />
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="table-post">
              <ComponentDataTable
                columns={getTableColumns()}
                data={state.items}
                i18={{
                  search: t('search'),
                  noRecords: t('noRecords'),
                }}
                isSearchable={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
