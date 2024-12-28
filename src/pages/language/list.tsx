import { TableColumn } from 'react-data-table-component';
import ComponentDataTable from '@components/elements/table/dataTable';
import { ILanguageGetResultService } from 'types/services/language.service';
import { LanguageService } from '@services/language.service';
import Image from 'next/image';
import ComponentThemeBadgeStatus from '@components/theme/badge/status';
import ComponentThemeModalUpdateItemRank from '@components/theme/modal/updateItemRank';
import ComponentToast from '@components/elements/toast';
import { PermissionUtil } from '@utils/permission.util';
import { LanguageEndPointPermission } from '@constants/endPointPermissions/language.endPoint.permission';
import { EndPoints } from '@constants/endPoints';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { RouteUtil } from '@utils/route.util';
import { use, useEffect, useReducer } from 'react';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useRouter } from 'next/router';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { SortUtil } from '@utils/sort.util';

type IComponentState = {
  items: ILanguageGetResultService[];
  selectedItemId: string;
  isShowModalUpdateRank: boolean;
};

const initialState: IComponentState = {
  items: [],
  selectedItemId: '',
  isShowModalUpdateRank: false,
};

type IAction =
  | { type: 'SET_ITEMS'; payload: ILanguageGetResultService[] }
  | { type: 'SET_SELECTED_ITEM_ID'; payload: string }
  | { type: 'SET_IS_SHOW_MODAL_UPDATE_RANK'; payload: boolean };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_SELECTED_ITEM_ID':
      return { ...state, selectedItemId: action.payload };
    case 'SET_IS_SHOW_MODAL_UPDATE_RANK':
      return { ...state, isShowModalUpdateRank: action.payload };
    default:
      return state;
  }
};

export default function PageSettingLanguageList() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);

  const init = async () => {
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        appDispatch,
        minPermission: LanguageEndPointPermission.GET,
      })
    ) {
      setPageTitle();
      await getItems();
      appDispatch(setIsPageLoadingState(false));
    }
  };

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
    };
  }, []);

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([{ title: t('languages') }, { title: t('list') }])
    );
  };

  const getItems = async () => {
    const result = await LanguageService.getMany({}, abortController.signal);

    if (result.status && result.data) {
      dispatch({ type: 'SET_ITEMS', payload: result.data });
    }
  };

  const onChangeRank = async (rank: number) => {
    const serviceResult = await LanguageService.updateRankWithId(
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
        RouteUtil.change({ appDispatch, router, path: path.EDIT(itemId) });
        break;
    }
  };

  const getTableColumns = (): TableColumn<IComponentState['items'][0]>[] => {
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
                dispatch({ type: 'SET_SELECTED_ITEM_ID', payload: row._id });
                dispatch({
                  type: 'SET_IS_SHOW_MODAL_UPDATE_RANK',
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

  const item = state.items.findSingle('_id', state.selectedItemId);

  return isPageLoading ? null : (
    <div className="page-post">
      <ComponentThemeModalUpdateItemRank
        isShow={state.isShowModalUpdateRank}
        onHide={() =>
          dispatch({ type: 'SET_IS_SHOW_MODAL_UPDATE_RANK', payload: false })
        }
        onSubmit={(rank) => onChangeRank(rank)}
        rank={item?.rank}
        title={item?.title}
      />
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="table-post">
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
