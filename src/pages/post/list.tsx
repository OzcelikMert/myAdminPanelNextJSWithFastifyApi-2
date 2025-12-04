import React, { useReducer, useState } from 'react';
import Swal from 'sweetalert2';
import { PostService } from '@services/post.service';
import { IPostGetManyResultService } from 'types/services/post.service';
import ComponentDataTable, {
  IComponentDataTableColumn,
} from '@components/elements/table/dataTable';
import Image from 'next/image';
import ComponentThemeBadgeStatus, {
  getStatusIcon,
} from '@components/theme/badge/status';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import ComponentThemeModalUpdateItemRank from '@components/theme/modal/updateItemRank';
import { ProductTypeId } from '@constants/productTypes';
import ComponentThemeBadgeProductType from '@components/theme/badge/productType';
import ComponentThemeBadgePageType from '@components/theme/badge/pageType';
import { PostTypeId } from '@constants/postTypes';
import { PostUtil } from '@utils/post.util';
import { PermissionUtil, PostPermissionMethod } from '@utils/permission.util';
import { status, StatusId } from '@constants/status';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { ProductUtil } from '@utils/product.util';
import { PageTypeId, pageTypes } from '@constants/pageTypes';
import { PostTermTypeId } from '@constants/postTermTypes';
import { RouteUtil } from '@utils/route.util';
import { UserRoleId } from '@constants/userRoles';
import ComponentThemeToolTipMissingLanguages from '@components/theme/tooltip/missingLanguages';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import { IComponentTableToggleMenuItem } from '@components/elements/table/toggleMenu';
import { IComponentTableFilterButton } from '@components/elements/table/filterButton';
import { SortUtil } from '@utils/sort.util';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentThemeWebsiteLinkPost from '@components/theme/websiteLink/post';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

type IPageState = {
  typeId: PostTypeId;
  items: IPostGetManyResultService[];
  selectedItems: IPostGetManyResultService[];
  selectedItemId: string;
  isShowModalUpdateRank: boolean;
  listMode: 'list' | 'deleted';
};

const initialState: IPageState = {
  typeId: PostTypeId.Blog,
  items: [],
  selectedItems: [],
  selectedItemId: '',
  isShowModalUpdateRank: false,
  listMode: 'list',
};

enum ActionTypes {
  SET_TYPE_ID,
  SET_ITEMS,
  SET_SELECTED_ITEMS,
  SET_SELECTED_ITEM_ID,
  SET_IS_SHOW_MODAL_UPDATE_RANK,
  SET_LIST_MODE,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_TYPE_ID, IPageState['typeId']>
  | IActionWithPayload<ActionTypes.SET_ITEMS, IPageState['items']>
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ITEMS,
      IPageState['selectedItems']
    >
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ITEM_ID,
      IPageState['selectedItemId']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
      IPageState['isShowModalUpdateRank']
    >
  | IActionWithPayload<ActionTypes.SET_LIST_MODE, IPageState['listMode']>;

const reducer = (state: IPageState, action: IAction): IPageState => {
  switch (action.type) {
    case ActionTypes.SET_TYPE_ID:
      return { ...state, typeId: action.payload };
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
  _id?: string;
  postTypeId: PostTypeId;
};

export default function PagePostList() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);
  const currencyId = useAppSelector((state) => state.settingState.currencyId);

  const getQueries = () => {
    return {
      ...router.query,
      postTypeId: Number(router.query.postTypeId ?? PostTypeId.Blog),
    } as IPageQueries;
  };

  let queries = getQueries();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    typeId: queries.postTypeId,
  });
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

  useEffectAfterDidMount(() => {
    queries = getQueries();
    dispatch({
      type: ActionTypes.SET_TYPE_ID,
      payload: Number(queries.postTypeId),
    });
    init();
  }, [router.query]);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    const minPermission = PermissionUtil.getPostPermission(
      state.typeId,
      PostPermissionMethod.GET
    );
    if (
      await PermissionUtil.checkAndRedirect({
        minPermission,
        router,
        sessionAuth,
        t,
        showToast,
      })
    ) {
      await getItems();
      setPageTitle();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = PostUtil.getPageTitles({
      t: t,
      postTypeId: state.typeId,
    });

    titles.push({
      title: t('list'),
    });

    appDispatch(setBreadCrumbState(titles));
  };

  const getItems = async () => {
    const result = await PostService.getMany(
      {
        typeId: [state.typeId],
        langId: mainLangId,
      },
      abortControllerRef.current.signal
    );

    if (result.status && result.data) {
      dispatch({ type: ActionTypes.SET_ITEMS, payload: result.data });
    }
  };

  const onChangeStatus = async (
    selectedRows: IPageState['items'],
    statusId: number
  ) => {
    const selectedItemId = selectedRows.map((row) => row._id); //state.selectedItems.map((item) => item._id);
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

        const serviceResult = await PostService.deleteMany(
          {
            _id: selectedItemId,
            typeId: state.typeId,
          },
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

      const serviceResult = await PostService.updateStatusMany(
        {
          _id: selectedItemId,
          typeId: state.typeId,
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
    const serviceResult = await PostService.updateRankWithId(
      {
        _id: state.selectedItemId,
        typeId: state.typeId,
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
        content: `'${newItem?.contents?.title}' ${t('itemEdited')}`,
        timeOut: 3,
      });
      return true;
    }
  };

  const navigatePage = (
    type: 'termEdit' | 'edit' | 'termList',
    itemId = '',
    termTypeId = 0
  ) => {
    const postTypeId = state.typeId;
    const pagePath = PostUtil.getPagePath(postTypeId);
    let path = '';
    switch (type) {
      case 'edit':
        path = pagePath.EDIT(itemId);
        break;
      case 'termEdit':
        path = pagePath.TERM_WITH(termTypeId).EDIT(itemId);
        break;
      case 'termList':
        path = pagePath.TERM_WITH(termTypeId).LIST;
        break;
    }
    RouteUtil.change({ router, path });
  };

  const onClickUpdateRank = (itemId: string) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM_ID, payload: itemId });
    dispatch({
      type: ActionTypes.SET_IS_SHOW_MODAL_UPDATE_RANK,
      payload: true,
    });
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

  const getTableColumns = (): IComponentDataTableColumn<
    IPageState['items'][0]
  >[] => {
    return [
      {
        name: t('image'),
        width: '105px',
        cell: (row) => {
          return row.contents &&
            row.contents.icon &&
            row.contents.icon.length > 0 ? (
            <small>{row.contents?.icon}</small>
          ) : (
            <div className="image pt-2 pb-2">
              <Image
                src={ImageSourceUtil.getUploadedImageSrc(row.contents?.image)}
                alt={row.contents?.title ?? ''}
                className="post-image img-fluid"
                width={75}
                height={75}
              />
            </div>
          );
        },
      },
      {
        name: t('title'),
        selector: (row) => row.contents?.title || t('[noLangAdd]'),
        cell: (row) => (
          <div className="row w-100">
            <div className="col-md-8">
              {
                <ComponentThemeToolTipMissingLanguages
                  alternates={row.alternates ?? []}
                />
              }
              <ComponentThemeWebsiteLinkPost
                typeId={row.typeId}
                text={row.contents?.title || t('[noLangAdd]')}
                url={row.contents?.url}
              />
            </div>
            <div className="col-md-4">
              {row.isFixed ? (
                <i className="mdi mdi-pin text-success fs-5"></i>
              ) : null}
            </div>
          </div>
        ),
        width: '250px',
        sortable: true,
        isSearchable: true,
      },
      [
        PostTypeId.Blog,
        PostTypeId.Portfolio,
        PostTypeId.Product,
        PostTypeId.BeforeAndAfter,
      ].includes(state.typeId)
        ? {
            name: t('category'),
            width: '250px',
            cell: (row) =>
              row.categories && row.categories.length > 0 ? (
                <div className="d-flex flex-row overflow-auto">
                  {row.categories.map((item) =>
                    typeof item != 'undefined' ? (
                      <label
                        onClick={() =>
                          navigatePage('termEdit', item._id, item.typeId)
                        }
                        className={`badge badge-gradient-success m-1 cursor-pointer`}
                      >
                        {item.contents?.title || t('[noLangAdd]')}
                      </label>
                    ) : null
                  )}
                </div>
              ) : (
                t('notSelected')
              ),
          }
        : {},
      [PostTypeId.Product].includes(state.typeId)
        ? {
            name: t('productType'),
            selector: (row) => row.eCommerce?.typeId || 0,
            sortable: true,
            cell: (row) => (
              <ComponentThemeBadgeProductType
                typeId={row.eCommerce?.typeId || ProductTypeId.SimpleProduct}
              />
            ),
          }
        : {},
      [PostTypeId.Product].includes(state.typeId)
        ? {
            name: t('price'),
            selector: (row) => ProductUtil.getPricingDefault(row).taxIncluded,
            sortable: true,
            cell: (row) => {
              return (
                <div>
                  <span>{ProductUtil.getPricingDefault(row).taxIncluded}</span>
                  <span className="ms-1">
                    {ProductUtil.getCurrencyType(currencyId)?.icon}
                  </span>
                </div>
              );
            },
          }
        : {},
      [
        PostTypeId.Page,
        PostTypeId.Blog,
        PostTypeId.Portfolio,
        PostTypeId.BeforeAndAfter,
        PostTypeId.Product,
      ].includes(state.typeId)
        ? {
            name: t('views'),
            selector: (row) => row.views || 0,
            sortable: true,
          }
        : {},
      [PostTypeId.Page].includes(state.typeId)
        ? {
            name: t('pageType'),
            selector: (row) =>
              t(
                pageTypes.findSingle(
                  'id',
                  row.pageTypeId ? row.pageTypeId : PageTypeId.Default
                )?.langKey ?? '[noLangAdd]'
              ),
            sortable: true,
            cell: (row) => (
              <ComponentThemeBadgePageType
                typeId={row.pageTypeId || PageTypeId.Default}
              />
            ),
          }
        : {},
      {
        name: t('status'),
        sortable: true,
        cell: (row) => (
          <ComponentThemeBadgeStatus
            statusId={row.statusId}
            date={row.dateStart}
          />
        ),
      },
      {
        name: t('updatedBy'),
        selector: (row) =>
          row.lastAuthor?.name +
          new Date(row.updatedAt || '').toLocaleDateString(),
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
          return (row.typeId == PostTypeId.Page &&
            PermissionUtil.checkPermissionRoleRank(
              sessionAuth!.user.roleId,
              UserRoleId.SuperAdmin
            )) ||
            (row.typeId != PostTypeId.Page &&
              PermissionUtil.check(
                sessionAuth!,
                PermissionUtil.getPostPermission(
                  state.typeId,
                  PostPermissionMethod.UPDATE
                )
              )) ? (
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
      PermissionUtil.check(
        sessionAuth!,
        PermissionUtil.getPostPermission(
          state.typeId,
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

  const isUserSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );
  const item = state.items.findSingle('_id', state.selectedItemId);
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
        rank={item?.rank}
        title={item?.contents?.title}
      />
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="row">
                {[
                  PostTypeId.Blog,
                  PostTypeId.Portfolio,
                  PostTypeId.Product,
                ].includes(state.typeId) ? (
                  <div className="col-6">
                    <button
                      className="btn btn-gradient-success btn-lg w-100"
                      onClick={() =>
                        navigatePage('termList', '', PostTermTypeId.Category)
                      }
                    >
                      <i className="fa fa-pencil-square-o"></i>{' '}
                      {t('editCategories').toCapitalizeCase()}
                    </button>
                  </div>
                ) : null}
                {[
                  PostTypeId.Blog,
                  PostTypeId.Portfolio,
                  PostTypeId.Page,
                  PostTypeId.Product,
                ].includes(state.typeId) ? (
                  <div className="col-6">
                    <button
                      className="btn btn-gradient-info btn-edit-tag btn-lg w-100"
                      onClick={() =>
                        navigatePage('termList', '', PostTermTypeId.Tag)
                      }
                    >
                      <i className="fa fa-pencil-square-o"></i>{' '}
                      {t('editTags').toCapitalizeCase()}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="row">
                {[PostTypeId.Product].includes(state.typeId) ? (
                  <div className="col-6">
                    <button
                      className="btn btn-gradient-primary btn-edit-tag btn-lg w-100"
                      onClick={() =>
                        navigatePage('termList', '', PostTermTypeId.Attributes)
                      }
                    >
                      <i className="fa fa-pencil-square-o"></i>{' '}
                      {t('editAttribute').toCapitalizeCase()}
                    </button>
                  </div>
                ) : null}
                {[PostTypeId.Product].includes(state.typeId) ? (
                  <div className="col-6">
                    <button
                      className="btn btn-gradient-warning btn-edit-tag btn-lg w-100"
                      onClick={() =>
                        navigatePage('termList', '', PostTermTypeId.Variations)
                      }
                    >
                      <i className="fa fa-pencil-square-o"></i>{' '}
                      {t('editVariation').toCapitalizeCase()}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-end"></div>
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
                  selectAll: t('selectAll'),
                  toggleMenuTitle: t('updateStatus'),
                }}
                isSelectable={isUserSuperAdmin}
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
