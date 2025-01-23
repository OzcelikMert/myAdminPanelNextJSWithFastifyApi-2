import Swal from 'sweetalert2';
import ComponentToast from '@components/elements/toast';
import ComponentDataTable, { IComponentDataTableColumn } from '@components/elements/table/dataTable';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import { PermissionUtil } from '@utils/permission.util';
import { EndPoints } from '@constants/endPoints';
import { IComponentGetResultService } from 'types/services/component.service';
import { ComponentEndPointPermission } from '@constants/endPointPermissions/component.endPoint.permission';
import { ComponentService } from '@services/component.service';
import { UserRoleId } from '@constants/userRoles';
import ComponentThemeBadgeComponentType from '@components/theme/badge/componentType';
import { ComponentTypeId } from '@constants/componentTypes';
import { RouteUtil } from '@utils/route.util';
import ComponentThemeToolTipMissingLanguages from '@components/theme/tooltip/missingLanguages';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { SortUtil } from '@utils/sort.util';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IPageState = {
  items: IComponentGetResultService[];
};

const initialState: IPageState = {
  items: [],
};

export default function PageComponentList() {
  const abortController = new AbortController();

  const router = useRouter();
  const appDispatch = useAppDispatch();
  const t = useAppSelector(selectTranslation);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const [items, setItems] = useState(initialState.items);
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
        t,
        sessionAuth,
        minPermission: ComponentEndPointPermission.GET,
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
          title: t('components'),
        },
        {
          title: t('list'),
        },
      ])
    );
  };

  const getItems = async () => {
    const result = await ComponentService.getMany(
      {
        langId: mainLangId,
      },
      abortController.signal
    );

    if (result.status && result.data) {
      setItems(result.data);
    }
  };

  const onDelete = async (_id: string) => {
    const item = items.findSingle('_id', _id);
    if (item) {
      const result = await Swal.fire({
        title: t('deleteAction'),
        html: `<b>'${item.title}'</b> ${t('deleteItemQuestionWithItemName')}`,
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

        const serviceResult = await ComponentService.deleteMany(
          { _id: [_id] },
          abortController.signal
        );
        loadingToast.hide();
        if (serviceResult.status) {
          setItems(items.filter((item) => _id !== item._id));
          new ComponentToast({
            type: 'success',
            title: t('successful'),
            content: t('itemDeleted'),
          });
        }
      }
    }
  };

  const navigatePage = async (type: 'edit', itemId = '') => {
    const pagePath = EndPoints.COMPONENT_WITH;
    switch (type) {
      case 'edit':
        await RouteUtil.change({
          router,
          path: pagePath.EDIT(itemId),
        });
        break;
    }
  };

  const getTableColumns = (): IComponentDataTableColumn<IPageState['items'][0]>[] => {
    return [
      {
        name: t('title'),
        selector: (row) => row.title,
        cell: (row) => {
          return (
            <div className="row w-100">
              <div className="col-md-12">
                {
                  <ComponentThemeToolTipMissingLanguages
                    itemLanguages={
                      row.elements.map((element) => element.alternates ?? [])
                    }
                  />
                }
                {row.title}
              </div>
            </div>
          );
        },
        sortable: true,
        isSearchable: true
      },
      PermissionUtil.checkPermissionRoleRank(
        sessionAuth!.user.roleId,
        UserRoleId.SuperAdmin
      )
        ? {
            name: t('key'),
            selector: (row) => row.key,
            sortable: true,
          }
        : {},
      {
        name: t('typeId'),
        sortable: true,
        selector: (row) => row.typeId,
        cell: (row) => (
          <ComponentThemeBadgeComponentType
            typeId={row.typeId || ComponentTypeId.Private}
          />
        ),
      },
      {
        name: t('updatedBy'),
        sortable: true,
        selector: (row) => new Date(row.updatedAt || '').toLocaleDateString(),
        cell: (row) => (
          <ComponentTableUpdatedBy
            name={row.lastAuthorId.name}
            updatedAt={row.updatedAt || ''}
          />
        ),
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
      PermissionUtil.check(sessionAuth!, ComponentEndPointPermission.UPDATE)
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
      PermissionUtil.check(sessionAuth!, ComponentEndPointPermission.DELETE)
        ? {
            name: '',
            width: '70px',
            button: true,
            cell: (row) => (
              <button
                onClick={() => onDelete(row._id)}
                className="btn btn-gradient-danger"
              >
                <i className="mdi mdi-trash-can-outline"></i>
              </button>
            ),
          }
        : {},
    ];
  };

  return isPageLoading ? null : (
    <div className="page-component">
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="table-post">
              <ComponentDataTable
                columns={getTableColumns()}
                data={items}
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
