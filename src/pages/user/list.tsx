import { useReducer, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import { IUserGetResultService } from 'types/services/user.service';
import ComponentThemeUsersProfileCard from '@components/theme/modal/userProfileCard';
import { UserService } from '@services/user.service';
import ComponentToast from '@components/elements/toast';
import ComponentDataTable from '@components/elements/table/dataTable';
import Image from 'next/image';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentThemeBadgeUserRole from '@components/theme/badge/userRole';
import { UserRoleId, userRoles } from '@constants/userRoles';
import { PermissionUtil } from '@utils/permission.util';
import { UserEndPointPermission } from '@constants/endPointPermissions/user.endPoint.permission';
import { EndPoints } from '@constants/endPoints';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { status } from '@constants/status';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import { RouteUtil } from '@utils/route.util';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { SortUtil } from '@utils/sort.util';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IComponentState = {
  items: IUserGetResultService[];
  isShowItemModal: boolean;
  selectedItemId: string;
};

const initialState: IComponentState = {
  items: [],
  isShowItemModal: false,
  selectedItemId: '',
};

enum ActionTypes {
  SET_ITEMS,
  SET_IS_SHOW_ITEM_MODAL,
  SET_SELECTED_ITEM_ID,
}

type IAction =
  | { type: ActionTypes.SET_ITEMS; payload: IComponentState['items'] }
  | {
      type: ActionTypes.SET_IS_SHOW_ITEM_MODAL;
      payload: IComponentState['isShowItemModal'];
    }
  | {
      type: ActionTypes.SET_SELECTED_ITEM_ID;
      payload: IComponentState['selectedItemId'];
    };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_IS_SHOW_ITEM_MODAL:
      return { ...state, isShowItemModal: action.payload };
    case ActionTypes.SET_SELECTED_ITEM_ID:
      return { ...state, selectedItemId: action.payload };
    default:
      return state;
  }
};

export default function PageUserList() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, initialState);
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

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission: UserEndPointPermission.GET,
      })
    ) {
      setPageTitle();
      await getItems();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('users'),
        },
        {
          title: t('list'),
        },
      ])
    );
  };

  const getItems = async () => {
    const result = await UserService.getMany({}, abortController.signal);
    if (result.status && result.data) {
      const items = result.data.orderBy('roleId', 'desc');
      dispatch({
        type: ActionTypes.SET_ITEMS,
        payload: items.filter(
          (item) =>
            item.roleId != UserRoleId.SuperAdmin ||
            item._id != sessionAuth?.user.userId
        ),
      });
    }
  };

  const onDelete = async (userId: string) => {
    const item = state.items.findSingle('_id', userId);
    if (item) {
      const result = await Swal.fire({
        title: t('deleteAction'),
        html: `<b>'${item.name}'</b> ${t('deleteItemQuestionWithItemName')}`,
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

        const serviceResult = await UserService.deleteWithId(
          { _id: userId },
          abortController.signal
        );
        loadingToast.hide();
        if (serviceResult.status) {
          dispatch({
            type: ActionTypes.SET_ITEMS,
            payload: state.items.filter((item) => userId !== item._id),
          });
          new ComponentToast({
            type: 'success',
            title: t('successful'),
            content: t('itemDeleted'),
          });
        }
      }
    }
  };

  const onViewUser = (userId: string) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM_ID, payload: userId });
    dispatch({ type: ActionTypes.SET_IS_SHOW_ITEM_MODAL, payload: true });
  };

  const navigatePage = (type: 'edit', itemId = '') => {
    const path = EndPoints.USER_WITH.EDIT(itemId);
    RouteUtil.change({ router, path });
  };

  const getTableColumns = (): TableColumn<IComponentState['items'][0]>[] => {
    return [
      {
        name: t('image'),
        width: '105px',
        cell: (row) => (
          <div className="image mt-2 mb-2">
            <Image
              src={ImageSourceUtil.getUploadedImageSrc(row.image)}
              alt={row.name}
              width={75}
              height={75}
              className="img-fluid"
            />
            <span
              className={`availability-status ${row.isOnline ? 'online' : 'offline'}`}
            ></span>
          </div>
        ),
      },
      {
        name: t('name'),
        selector: (row) => row.name,
        sortable: true,
        cell: (row) => <b>{row.name}</b>,
      },
      {
        id: 'userRole',
        name: t('role'),
        selector: (row) => userRoles.findSingle('id', row.roleId)?.rank ?? 0,
        sortable: true,
        cell: (row) => <ComponentThemeBadgeUserRole userRoleId={row.roleId} />,
      },
      {
        name: t('updatedBy'),
        sortable: true,
        cell: (row) => (
          <ComponentTableUpdatedBy
            name={row.lastAuthorId?.name || ''}
            updatedAt={row.updatedAt || ''}
          />
        ),
      },
      {
        name: t('status'),
        selector: (row) => status.findSingle('id', row.statusId)?.rank ?? 0,
        sortable: true,
        cell: (row) => <ComponentThemeBadgeStatus statusId={row.statusId} />,
      },
      {
        name: t('createdDate'),
        sortable: true,
        selector: (row) => new Date(row.createdAt || '').toLocaleDateString(),
        sortFunction: (a, b) => SortUtil.sortByDate(a.createdAt, b.createdAt),
        cell: (row) => (
          <ComponentTableUpdatedBy
            name={row.authorId?.name || ''}
            updatedAt={row.createdAt || ''}
          />
        ),
      },
      {
        name: '',
        width: '70px',
        cell: (row) => (
          <button
            onClick={() => onViewUser(row._id)}
            className="btn btn-gradient-info"
          >
            <i className="mdi mdi-eye"></i>
          </button>
        ),
      },
      PermissionUtil.check(sessionAuth!, UserEndPointPermission.UPDATE)
        ? {
            name: '',
            button: true,
            width: '70px',
            cell: (row) => {
              const sessionUserRole = userRoles.findSingle(
                'id',
                sessionAuth?.user.roleId
              );
              const rowUserRole = userRoles.findSingle('id', row.roleId);
              return sessionUserRole &&
                rowUserRole &&
                rowUserRole.rank < sessionUserRole.rank ? (
                <button
                  onClick={() => navigatePage('edit', row._id)}
                  className="btn btn-gradient-warning"
                >
                  <i className="fa fa-pencil-square-o"></i>
                </button>
              ) : null;
            },
          }
        : {},
      PermissionUtil.check(sessionAuth!, UserEndPointPermission.DELETE)
        ? {
            name: '',
            button: true,
            width: '70px',
            cell: (row) => {
              const sessionUserRole = userRoles.findSingle(
                'id',
                sessionAuth?.user.roleId
              );
              const rowUserRole = userRoles.findSingle('id', row.roleId);
              return sessionUserRole &&
                rowUserRole &&
                rowUserRole.rank < sessionUserRole.rank ? (
                <button
                  onClick={() => onDelete(row._id)}
                  className="btn btn-gradient-danger"
                >
                  <i className="mdi mdi-trash-can-outline"></i>
                </button>
              ) : null;
            },
          }
        : {},
    ];
  };

  const selectedItem = state.items.findSingle('_id', state.selectedItemId);

  return isPageLoading ? null : (
    <div className="page-user">
      {selectedItem ? (
        <ComponentThemeUsersProfileCard
          onClose={() => {
            dispatch({
              type: ActionTypes.SET_IS_SHOW_ITEM_MODAL,
              payload: false,
            });
          }}
          isShow={state.isShowItemModal}
          userInfo={selectedItem}
        />
      ) : null}
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="table-user">
              <ComponentDataTable
                columns={getTableColumns().filter(
                  (column) => typeof column.name !== 'undefined'
                )}
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
