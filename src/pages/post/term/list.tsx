import { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import { IPostTermGetResultService } from 'types/services/postTerm.service';
import { PostTermService } from '@services/postTerm.service';
import ComponentToast from '@components/elements/toast';
import ComponentDataTable from '@components/elements/table/dataTable';
import Image from 'next/image';
import ComponentThemeBadgeStatus, {
  getStatusIcon,
} from '@components/theme/badge/status';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import ComponentThemeModalUpdateItemRank from '@components/theme/modal/updateItemRank';
import { PostTermTypeId } from '@constants/postTermTypes';
import { PostTypeId } from '@constants/postTypes';
import { PermissionUtil, PostPermissionMethod } from '@utils/permission.util';
import { PostUtil } from '@utils/post.util';
import { status, StatusId } from '@constants/status';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { RouteUtil } from '@utils/route.util';
import ComponentThemeToolTipMissingLanguages from '@components/theme/tooltip/missingLanguages';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useEffect, useReducer, useState } from 'react';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import { IComponentTableFilterButton } from '@components/elements/table/filterButton';
import { IComponentTableToggleMenuItem } from '@components/elements/table/toggleMenu';
import { SortUtil } from '@utils/sort.util';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IPageState = {
  typeId: PostTermTypeId;
  postTypeId: PostTypeId;
  items: IPostTermGetResultService[];
  selectedItems: IPostTermGetResultService[];
  selectedItemId: string;
  isShowModalUpdateRank: boolean;
  listMode: 'list' | 'deleted';
};

const initialState: IPageState = {
  typeId: PostTermTypeId.Category,
  postTypeId: PostTypeId.Blog,
  items: [],
  selectedItems: [],
  selectedItemId: '',
  isShowModalUpdateRank: false,
  listMode: 'list',
};

enum ActionTypes {
  SET_TYPE_ID,
  SET_POST_TYPE_ID,
  SET_ITEMS,
  SET_SELECTED_ITEMS,
  SET_SELECTED_ITEM_ID,
  SET_IS_SHOW_MODAL_UPDATE_RANK,
  SET_LIST_MODE,
}

type IAction =
  | { type: ActionTypes.SET_TYPE_ID; payload: IPageState['typeId'] }
  | {
      type: ActionTypes.SET_POST_TYPE_ID;
      payload: IPageState['postTypeId'];
    }
  | { type: ActionTypes.SET_ITEMS; payload: IPageState['items'] }
  | {
      type: ActionTypes.SET_SELECTED_ITEMS;
      payload: IPageState['selectedItems'];
    }
  | {
      type: ActionTypes.SET_SELECTED_ITEM_ID;
      payload: IPageState['selectedItemId'];
    }
  | {
      type: ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK;
      payload: IPageState['isShowModalUpdateRank'];
    }
  | { type: ActionTypes.SET_LIST_MODE; payload: IPageState['listMode'] };

const reducer = (state: IPageState, action: IAction): IPageState => {
  switch (action.type) {
    case ActionTypes.SET_TYPE_ID:
      return { ...state, typeId: action.payload };
    case ActionTypes.SET_POST_TYPE_ID:
      return { ...state, postTypeId: action.payload };
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

type IPageQueries = {
  termTypeId: PostTermTypeId;
  postTypeId: PostTypeId;
};

export default function PagePostTermList() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const getQueries = () => {
    return {
      ...router.query,
      termTypeId: Number(router.query.termTypeId ?? PostTermTypeId.Category),
      postTypeId: Number(router.query.postTypeId ?? PostTypeId.Blog)
    } as IPageQueries
  }

  let queries = getQueries();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    typeId: queries.termTypeId,
    postTypeId: queries.postTypeId,
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useDidMount(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  useEffectAfterDidMount(() => {
    if (isPageLoaded) {
      appDispatch(setIsPageLoadingState(false));
    }
  }, [isPageLoaded]);

  useEffectAfterDidMount(() => {
    queries = getQueries();
    dispatch({
      type: ActionTypes.SET_TYPE_ID,
      payload: Number(queries.termTypeId),
    });
    dispatch({
      type: ActionTypes.SET_POST_TYPE_ID,
      payload: Number(queries.postTypeId),
    });
    init();
  }, [router.query]);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    const minPermission = PermissionUtil.getPostPermission(
      state.postTypeId,
      PostPermissionMethod.GET
    );
    if (
      PermissionUtil.checkAndRedirect({
        minPermission,
        router,
        sessionAuth,
        t,
      })
    ) {
      setPageTitle();
      await getItems();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = PostUtil.getPageTitles({
      t: t,
      postTypeId: state.postTypeId,
      termTypeId: state.typeId,
    });

    titles.push({
      title: t('list'),
    });

    appDispatch(setBreadCrumbState(titles));
  };

  const getItems = async () => {
    const result = await PostTermService.getMany(
      {
        typeId: [state.typeId],
        postTypeId: state.postTypeId,
        langId: mainLangId,
        withPostCount: [PostTermTypeId.Category].includes(state.typeId),
      },
      abortController.signal
    );

    if (result.status && result.data) {
      dispatch({ type: ActionTypes.SET_ITEMS, payload: result.data });
    }
  };

  const onChangeStatus = async (selectedRows: IPostTermGetResultService[], statusId: number) => {
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
        const loadingToast = new ComponentToast({
          content: t('deleting'),
          type: 'loading',
        });

        const serviceResult = await PostTermService.deleteMany(
          {
            _id: selectedItemId,
            typeId: state.typeId,
            postTypeId: state.postTypeId,
          },
          abortController.signal
        );

        loadingToast.hide();
        if (serviceResult.status) {
          const newItems = state.items.filter(
            (item) => !selectedItemId.includes(item._id)
          );
          dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
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

      const serviceResult = await PostTermService.updateStatusMany(
        {
          _id: selectedItemId,
          typeId: state.typeId,
          postTypeId: state.postTypeId,
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
        dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
        new ComponentToast({
          type: 'success',
          title: t('successful'),
          content: t('statusUpdated'),
        });
      }
    }
  };

  const onChangeRank = async (rank: number) => {
    const serviceResult = await PostTermService.updateRankWithId(
      {
        _id: state.selectedItemId,
        rank: rank,
        postTypeId: state.postTypeId,
        typeId: state.typeId,
      },
      abortController.signal
    );

    if (serviceResult.status) {
      let newItems = state.items;
      let newItem = newItems.findSingle('_id', state.selectedItemId);
      if (newItem) {
        newItem.rank = rank;
      }
      dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `'${newItem?.contents?.title}' ${t('itemEdited')}`,
        timeOut: 3,
      });
      return true;
    }
  };

  const onClickTableFilterButton = (item: IComponentTableFilterButton) => {
    dispatch({ type: ActionTypes.SET_LIST_MODE, payload: item.key });
  };

  const onClickUpdateRank = (itemId: string) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM_ID, payload: itemId });
    dispatch({
      type: ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
      payload: true,
    });
  };

  const navigatePage = (type: 'add' | 'back' | 'edit', postTermId = '') => {
    const postTypeId = state.postTypeId;
    const postTermTypeId = state.typeId;
    const pagePath = PostUtil.getPagePath(postTypeId);
    let path = '';
    switch (type) {
      case 'add':
        path = pagePath.TERM_WITH(postTermTypeId).ADD;
        break;
      case 'edit':
        path = pagePath.TERM_WITH(postTermTypeId).EDIT(postTermId);
        break;
      case 'back':
        path = pagePath.LIST;
        break;
    }
    RouteUtil.change({ router, path: path });
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
        onFilter: (items) =>
          items.findMulti('statusId', StatusId.Deleted, false),
      },
      {
        title: `${t('trash')} (${state.items.findMulti('statusId', StatusId.Deleted).length})`,
        className: 'btn-gradient-danger',
        icon: 'mdi mdi-delete',
        onFilter: (items) => items.findMulti('statusId', StatusId.Deleted),
      },
    ];
  };

  const getTableColumns = (): TableColumn<IPageState['items'][0]>[] => {
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
              className="img-fluid"
            />
          </div>
        ),
      },
      {
        name: t('title'),
        selector: (row) => row.contents?.title || t('[noLangAdd]'),
        sortable: true,
        cell: (row) => (
          <div className="row w-100">
            <div className="col-md-12">
              {
                <ComponentThemeToolTipMissingLanguages
                  itemLanguages={row.alternates ?? []}
                />
              }
              {row.contents?.title || t('[noLangAdd]')}
            </div>
          </div>
        ),
        width: '250px',
      },
      [PostTermTypeId.Category, PostTermTypeId.Variations].includes(
        state.typeId
      )
        ? {
            name: t('main'),
            selector: (row) =>
              row.parentId
                ? row.parentId.contents?.title || t('[noLangAdd]')
                : t('notSelected'),
            sortable: true,
          }
        : {},
      [PostTermTypeId.Category].includes(state.typeId)
        ? {
            name: t('numberOfUses'),
            sortable: true,
            selector: (row) => row.postCount ?? 0,
          }
        : {},
      {
        name: t('views'),
        selector: (row) => row.views || 0,
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
            PermissionUtil.getPostPermission(
              state.postTypeId,
              PostPermissionMethod.UPDATE
            )
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
        PermissionUtil.getPostPermission(
          state.postTypeId,
          PostPermissionMethod.UPDATE
        )
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
  };

  const selectedItem = state.items.findSingle('_id', state.selectedItemId);

  return isPageLoading ? null : (
    <div className="page-post-term">
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
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="row">
            <div className="col-6">
              <button
                className="btn btn-gradient-dark btn-lg w-100"
                onClick={() => navigatePage('back')}
              >
                <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
              </button>
            </div>
            <div className="col-6 text-end">
              {PermissionUtil.check(
                sessionAuth!,
                PermissionUtil.getPostPermission(
                  state.postTypeId,
                  PostPermissionMethod.ADD
                )
              ) ? (
                <button
                  className="btn btn-gradient-info btn-lg w-100"
                  onClick={() => navigatePage('add')}
                >
                  + {t('addNew')}
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-md-9 mb-3"></div>
      </div>
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
                    PermissionUtil.getPostPermission(
                      state.postTypeId,
                      PostPermissionMethod.UPDATE
                    )
                  ) ||
                  PermissionUtil.check(
                    sessionAuth!,
                    PermissionUtil.getPostPermission(
                      state.postTypeId,
                      PostPermissionMethod.DELETE
                    )
                  )
                }
                isAllSelectable={true}
                isSearchable={true}
                toggleMenuItems={getToggleMenuItems()}
                onClickToggleMenuItem={(selectedRows, value) => onChangeStatus(selectedRows, value)}
                filterButtons={getTableFilterButtons()}
                onClickFilterButton={(item) => onClickTableFilterButton(item)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
