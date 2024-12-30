import { useEffect, useReducer } from 'react';
import { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import ComponentToast from '@components/elements/toast';
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
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { IComponentTableFilterButton } from '@components/elements/table/filterButton';
import { SortUtil } from '@utils/sort.util';
import { setIsPageLoadingState } from '@lib/features/pageSlice';

type IComponentState = {
  items: INavigationGetResultService[];
  selectedItems: INavigationGetResultService[];
  selectedItemId: string;
  isShowModalUpdateRank: boolean;
  listMode?: 'list' | 'deleted';
};

const initialState: IComponentState = {
  items: [],
  selectedItems: [],
  selectedItemId: '',
  isShowModalUpdateRank: false,
  listMode: 'list',
};

type IAction = 
  | { type: 'SET_ITEMS', payload: IComponentState['items'] }
  | { type: 'SET_SELECTED_ITEMS', payload: IComponentState['selectedItems'] }
  | { type: 'SET_SELECTED_ITEM_ID', payload: IComponentState['selectedItemId'] }
  | { type: 'SET_LIST_MODE', payload: IComponentState['listMode'] }
  | { type: 'SET_IS_SHOW_MODAL_UPDATE_RANK', payload: IComponentState['isShowModalUpdateRank'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_SELECTED_ITEMS':
      return { ...state, selectedItems: action.payload };
    case 'SET_SELECTED_ITEM_ID':
      return { ...state, selectedItemId: action.payload };
    case 'SET_IS_SHOW_MODAL_UPDATE_RANK':
      return { ...state, isShowModalUpdateRank: action.payload };
    case 'SET_LIST_MODE':
      return { ...state, listMode: action.payload };
    default:
      return state;
  }
}

export default function PageNavigationList() {
  const abortController = new AbortController();

   const router = useRouter();
    const t = useAppSelector(selectTranslation);
    const appDispatch = useAppDispatch();
    const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
    const sessionAuth = useAppSelector((state) => state.sessionState.auth);
    const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
    }
  }, []);

  const init = async () => {
    if (
      PermissionUtil.checkAndRedirect({
        appDispatch,
        router,
        sessionAuth,
        t,
        minPermission: NavigationEndPointPermission.GET
  })
    ) {
      setPageTitle();
      await getItems();
      appDispatch(setIsPageLoadingState(false));
    }
  }

  const setPageTitle = () => {
    appDispatch(setBreadCrumbState([
      { title: t('navigations') },
      { title: t('list') },
    ]));
  }

  const getItems = async () => {
    const result = await NavigationService.getMany(
      {
        langId: mainLangId,
      },
      abortController.signal
    );

    if (result.status && result.data) {
      dispatch({ type: 'SET_ITEMS', payload: result.data });
    }
  }

  const onChangeStatus = async (statusId: number) => {
    const selectedItemId = state.selectedItems.map((item) => item._id);
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
        const loadingToast = new ComponentToast({
          content: t('deleting'),
          type: 'loading',
        });

        const serviceResult = await NavigationService.deleteMany(
          { _id: selectedItemId },
          abortController.signal
        );
        loadingToast.hide();
        if (serviceResult.status) {
          const newItems = state.items.filter((item) => !selectedItemId.includes(item._id))
          dispatch({ type: "SET_ITEMS", payload: newItems });
          new ComponentToast({
            type: 'success',
            title: t('successful'),
            content: t('itemDeleted'),
          });
        }
      }
    } else {
      const loadingToast = new ComponentToast({
        content: t('updating'),
        type: 'loading',
      });
      const serviceResult = await NavigationService.updateStatusMany(
        {
          _id: selectedItemId,
          statusId: statusId,
        },
        abortController.signal
      );
      loadingToast.hide();
      if (serviceResult.status) {
        const newItems = state.items.map((item) => {
          if (selectedItemId.includes(item._id)) {
            item.statusId = statusId;
          }
          return item;
        });
        dispatch({ type: "SET_ITEMS", payload: newItems });
        new ComponentToast({
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
      abortController.signal
    );

    if (serviceResult.status) {
      let newItems = state.items;
      let newItem = newItems.findSingle('_id', state.selectedItemId);
      if (newItem) {
        newItem.rank = rank;
      }
      dispatch({ type: 'SET_ITEMS', payload: newItems });
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `'${newItem?.contents?.title}' ${t('itemEdited')}`,
        timeOut: 3,
      });
      return true;
    }
  }

  const onClickTableFilterButton = (item: IComponentTableFilterButton) => {
    dispatch({ type: 'SET_LIST_MODE', payload: item.key });
  }

  const onSelect = (selectedRows: IComponentState['items']) =>{
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: selectedRows });
  }

  const navigatePage = (type: 'edit', itemId = '') => {
    const path = EndPoints.NAVIGATION_WITH;
    switch (type) {
      case 'edit':
        RouteUtil.change({ appDispatch, router, path: path.EDIT(itemId) });
        break;
    }
  }

  const onClickUpdateRank = (itemId: string) => {
    dispatch({ type: 'SET_SELECTED_ITEM_ID', payload: itemId });
    dispatch({ type: 'SET_IS_SHOW_MODAL_UPDATE_RANK', payload: true });
  }

  const getToggleMenuItems = (): IComponentTableToggleMenuItem[] => {
    return status
      .findMulti('id', [StatusId.Active, StatusId.InProgress, StatusId.Deleted])
      .map((item) => ({
        label: t(item.langKey),
        value: item.id,
        icon: getStatusIcon(item.id),
      }));
  }

  const getFilterButtons = (): IComponentTableFilterButton[] => {
    return [
      {
        title: `${t('list')} (${state.items.findMulti('statusId', StatusId.Deleted, false).length})`,
        className: 'btn-gradient-success',
        icon: 'mdi mdi-view-list',
        onFilter: (items) => items,
      },
      {
        title: `${t('trash')} (${state.items.findMulti('statusId', StatusId.Deleted).length})`,
        className: 'btn-gradient-danger',
        icon: 'mdi mdi-delete',
        onFilter: (items) => items.findMulti('statusId', StatusId.Deleted),
      },
    ]
  }

  const getTableColumns = (): TableColumn<IComponentState['items'][0]>[] => {
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
            ? row.parentId.contents?.title || t('[noLangAdd]')
            : t('notSelected'),
        sortable: true,
      },
      {
        name: t('status'),
        sortable: true,
        cell: (row) => (
          <ComponentThemeBadgeStatus statusId={row.statusId} />
        ),
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
            name={row.authorId.name}
            updatedAt={row.createdAt || ''}
          />
        ),
      },
      PermissionUtil.check(
        sessionAuth!,
        NavigationEndPointPermission.UPDATE
      )
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
  }


    const selectedItem = state.items.findSingle('_id', state.selectedItemId);

    return isPageLoading ? null : (
      <div className="page-navigation">
        <ComponentThemeModalUpdateItemRank
          isShow={state.isShowModalUpdateRank}
          onHide={() => dispatch({ type: "SET_IS_SHOW_MODAL_UPDATE_RANK", payload: false })}
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
                  onSelect={(rows) => onSelect(rows)}
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
                  isActiveToggleMenu={true}
                  toggleMenuItems={getToggleMenuItems()}
                  onClickToggleMenuItem={(value) => onChangeStatus(value)}
                  filterButtons={getFilterButtons()}
                  onClickFilterButton={(item) => onClickTableFilterButton(item)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  
}