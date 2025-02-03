import React, { useReducer, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import ComponentDataTable from '@components/elements/table/dataTable';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { NavigationService } from '@services/navigation.service';
import { IComponentTableToggleMenuItem } from '@components/elements/table/toggleMenu';
import ComponentThemeBadgeStatus, {
  getStatusIcon,
} from '@components/theme/badge/status';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import ComponentThemeModalUpdateItemRank from '@components/theme/modal/updateItemRank';
import { PermissionUtil } from '@utils/permission.util';
import { NavigationEndPointPermission } from '@constants/endPointPermissions/navigation.endPoint.permission';
import { status, StatusId } from '@constants/status';
import { EndPoints } from '@constants/endPoints';
import { RouteUtil } from '@utils/route.util';
import ComponentThemeToolTipMissingLanguages from '@components/theme/tooltip/missingLanguages';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { IComponentTableFilterButton } from '@components/elements/table/filterButton';
import { SortUtil } from '@utils/sort.util';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

type IPageState = {
  items: INavigationGetResultService[];
  selectedItems: INavigationGetResultService[];
  selectedItemId: string;
  isShowModalUpdateRank: boolean;
  listMode?: 'list' | 'deleted';
};

const initialState: IPageState = {
  items: [],
  selectedItems: [],
  selectedItemId: '',
  isShowModalUpdateRank: false,
  listMode: 'list',
};

enum ActionTypes {
  SET_ITEMS,
  SET_SELECTED_ITEMS,
  SET_SELECTED_ITEM_ID,
  SET_LIST_MODE,
  SET_IS_SHOW_MODAL_UPDATE_RANK,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_ITEMS, IPageState['items']>
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ITEMS,
      IPageState['selectedItems']
    >
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ITEM_ID,
      IPageState['selectedItemId']
    >
  | IActionWithPayload<ActionTypes.SET_LIST_MODE, IPageState['listMode']>
  | IActionWithPayload<
      ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
      IPageState['isShowModalUpdateRank']
    >;

const reducer = (state: IPageState, action: IAction): IPageState => {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_SELECTED_ITEMS:
      return { ...state, selectedItems: action.payload };
    case ActionTypes.SET_SELECTED_ITEM_ID:
      return { ...state, selectedItemId: action.payload };
    case ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK:
      return { ...state, isShowModalUpdateRank: action.payload };
    case ActionTypes.SET_LIST_MODE:
      return { ...state, listMode: action.payload };
    default:
      return state;
  }
};

export default function PageNavigationList() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { showToast, hideToast } = useToast();
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
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission: NavigationEndPointPermission.GET,
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
      setBreadCrumbState([{ title: t('navigations') }, { title: t('list') }])
    );
  };

  const getItems = async () => {
    const result = await NavigationService.getMany(
      {
        langId: mainLangId,
      },
      abortControllerRef.current.signal
    );

    if (result.status && result.data) {
      dispatch({ type: ActionTypes.SET_ITEMS, payload: result.data });
    }
  };

  const onChangeStatus = async (
    selectedRows: INavigationGetResultService[],
    statusId: number
  ) => {
    const selectedItemId = selectedRows.map((item) => item._id);
    if (statusId === StatusId.Deleted && state.listMode === 'deleted') {
      const result = await Swal.fire({
        title: t('deleteAction'),
        text: t('deleteSelectedItemsQuestion'),
        confirmButtonText: t('yes'),
        cancelButtonText: t('no'),
        icon: 'question',
        showCancelButton: true,
      });
      if (result.isConfirmed) {
        const loadingToast = showToast({
          content: t('deleting'),
          type: 'loading',
        });

        const serviceResult = await NavigationService.deleteMany(
          { _id: selectedItemId },
          abortControllerRef.current.signal
        );
        hideToast(loadingToast);
        if (serviceResult.status) {
          const newItems = state.items.filter(
            (item) => !selectedItemId.includes(item._id)
          );
          dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
          showToast({
            type: 'success',
            title: t('successful'),
            content: t('itemDeleted'),
          });
        }
      }
    } else {
      const loadingToast = showToast({
        content: t('updating'),
        type: 'loading',
      });
      const serviceResult = await NavigationService.updateStatusMany(
        {
          _id: selectedItemId,
          statusId: statusId,
        },
        abortControllerRef.current.signal
      );
      hideToast(loadingToast);
      if (serviceResult.status) {
        const newItems = state.items.map((item) => {
          if (selectedItemId.includes(item._id)) {
            item.statusId = statusId;
          }
          return item;
        });
        dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
        showToast({
          type: 'success',
          title: t('successful'),
          content: t('statusUpdated'),
        });
      }
    }
  };

  const onChangeRank = async (rank: number) => {
    const serviceResult = await NavigationService.updateRankWithId(
      {
        _id: state.selectedItemId,
        rank: rank,
      },
      abortControllerRef.current.signal
    );

    if (serviceResult.status) {
      let newItems = state.items;
      let newItem = newItems.findSingle('_id', state.selectedItemId);
      if (newItem) {
        newItem.rank = rank;
      }
      dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
      showToast({
        type: 'success',
        title: t('successful'),
        content: `'${newItem?.contents?.title}' ${t('itemEdited')}`,
        timeOut: 3,
      });
      return true;
    }
  };

  const onClickUpdateRank = (itemId: string) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM_ID, payload: itemId });
    dispatch({
      type: ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
      payload: true,
    });
  };

  const navigatePage = (type: 'edit', itemId = '') => {
    const path = EndPoints.NAVIGATION_WITH;
    switch (type) {
      case 'edit':
        RouteUtil.change({ router, path: path.EDIT(itemId) });
        break;
    }
  };

  const getToggleMenuItems = (): IComponentTableToggleMenuItem[] => {
    return status
      .findMulti('id', [StatusId.Active, StatusId.InProgress, StatusId.Deleted])
      .map((item) => ({
        label: t(item.langKey),
        value: item.id,
        icon: getStatusIcon(item.id),
      }));
  };

  const getTableFilterButtons = (): IComponentTableFilterButton<
    IPageState['items']
  >[] => {
    return [
      {
        title: `${t('list')} (${state.items.findMulti('statusId', StatusId.Deleted, false).length})`,
        className: 'btn-gradient-success',
        icon: 'mdi mdi-view-list',
        isDefault: true,
        onFilter: (items) => {
          dispatch({ type: ActionTypes.SET_LIST_MODE, payload: 'list' });
          return items.findMulti('statusId', StatusId.Deleted, false);
        },
      },
      {
        title: `${t('trash')} (${state.items.findMulti('statusId', StatusId.Deleted).length})`,
        className: 'btn-gradient-danger',
        icon: 'mdi mdi-delete',
        onFilter: (items) => {
          dispatch({ type: ActionTypes.SET_LIST_MODE, payload: 'deleted' });
          return items.findMulti('statusId', StatusId.Deleted);
        },
      },
    ];
  };

  const getTableColumns = (): TableColumn<IPageState['items'][0]>[] => {
    return [
      {
        name: t('title'),
        selector: (row) => row.contents?.title || t('[noLangAdd]'),
        cell: (row) => (
          <div className="row w-100">
            <div className="col-md-12">
              {
                <ComponentThemeToolTipMissingLanguages
                  itemLanguages={row.alternates ?? []}
                />
              }
              {row.parentId ? <span className="pe-3">-</span> : null}
              {row.contents?.title || t('[noLangAdd]')}
            </div>
          </div>
        ),
        width: '250px',
        sortable: true,
      },
      {
        name: t('main'),
        selector: (row) =>
          row.parentId
            ? row.parent?.contents?.title || t('[noLangAdd]')
            : t('notSelected'),
        sortable: true,
      },
      {
        name: t('status'),
        sortable: true,
        cell: (row) => <ComponentThemeBadgeStatus statusId={row.statusId} />,
      },
      {
        name: t('updatedBy'),
        sortable: true,
        cell: (row) => (
          <ComponentTableUpdatedBy
            name={row.lastAuthor?.name}
            updatedAt={row.updatedAt || ''}
          />
        ),
      },
      {
        name: t('rank'),
        sortable: true,
        selector: (row) => row.rank ?? 0,
        cell: (row) => {
          return PermissionUtil.check(
            sessionAuth!,
            NavigationEndPointPermission.UPDATE
          ) ? (
            <span
              className="cursor-pointer"
              onClick={() => onClickUpdateRank(row._id)}
            >
              {row.rank ?? 0} <i className="fa fa-pencil-square-o"></i>
            </span>
          ) : (
            <span>{row.rank ?? 0}</span>
          );
        },
      },
      {
        name: t('createdDate'),
        sortable: true,
        selector: (row) => new Date(row.createdAt || '').toLocaleDateString(),
        sortFunction: (a, b) => SortUtil.sortByDate(a.createdAt, b.createdAt),
        cell: (row) => (
          <ComponentTableUpdatedBy
            name={row.author?.name}
            updatedAt={row.createdAt || ''}
          />
        ),
      },
      PermissionUtil.check(sessionAuth!, NavigationEndPointPermission.UPDATE)
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
    <div className="page-navigation">
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
        title={selectedItem?.contents?.title}
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
                isSelectable={
                  PermissionUtil.check(
                    sessionAuth!,
                    NavigationEndPointPermission.UPDATE
                  ) ||
                  PermissionUtil.check(
                    sessionAuth!,
                    NavigationEndPointPermission.DELETE
                  )
                }
                isAllSelectable={true}
                isSearchable={true}
                toggleMenuItems={getToggleMenuItems()}
                onClickToggleMenuItem={(selectedRows, value) =>
                  onChangeStatus(selectedRows, value)
                }
                filterButtons={getTableFilterButtons()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
