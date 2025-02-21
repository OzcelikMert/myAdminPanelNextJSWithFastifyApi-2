import React, { useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import { ISubscriberGetResultService } from 'types/services/subscriber.service';
import { SubscriberService } from '@services/subscriber.service';
import ComponentDataTable from '@components/elements/table/dataTable';
import { getStatusIcon } from '@components/theme/badge/status';
import { status, StatusId } from '@constants/status';
import { PermissionUtil } from '@utils/permission.util';
import { SubscriberEndPointPermission } from '@constants/endPointPermissions/subscriber.endPoint.permission';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import { IComponentTableToggleMenuItem } from '@components/elements/table/toggleMenu';
import { SortUtil } from '@utils/sort.util';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { useToast } from '@hooks/toast';

type IPageState = {
  items: ISubscriberGetResultService[];
  selectedItems: ISubscriberGetResultService[];
};

const initialState: IPageState = {
  items: [],
  selectedItems: [],
};

export default function PageSubscribers() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [items, setItems] = useState<IPageState['items']>(initialState.items);
  const [selectedItems, setSelectedItems] = useState(
    initialState.selectedItems
  );
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
      await PermissionUtil.checkAndRedirect({
        router,
        t,
        sessionAuth,
        minPermission: SubscriberEndPointPermission.GET,
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
      setBreadCrumbState([
        {
          title: t('settings'),
          url: EndPoints.SETTINGS_WITH.GENERAL,
        },
        {
          title: t('subscribers'),
        },
      ])
    );
  };

  const getItems = async () => {
    const result = await SubscriberService.getMany(
      {},
      abortControllerRef.current.signal
    );

    if (result.status && result.data) {
      const items = result.data;
      setItems(items);
    }
  };

  const onChangeStatus = async (
    selectedRows: ISubscriberGetResultService[],
    statusId: number
  ) => {
    const selectedItemId = selectedRows.map((item) => item._id);

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

      const serviceResult = await SubscriberService.deleteMany(
        {
          _id: selectedItemId,
        },
        abortControllerRef.current.signal
      );

      hideToast(loadingToast);

      if (serviceResult.status) {
        const newItems = items.filter(
          (item) => !selectedItemId.includes(item._id)
        );
        setItems(newItems);
        showToast({
          type: 'success',
          title: t('successful'),
          content: t('itemDeleted'),
        });
      }
    }
  };

  const getToggleMenuItems = (): IComponentTableToggleMenuItem[] => {
    return status.findMulti('id', [StatusId.Deleted]).map((item) => ({
      label: t(item.langKey),
      value: item.id,
      icon: getStatusIcon(item.id),
    }));
  };

  const getTableColumns = (): TableColumn<IPageState['items'][0]>[] => {
    return [
      {
        name: t('email'),
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: t('createdDate'),
        sortable: true,
        selector: (row) => new Date(row.createdAt || '').toLocaleDateString(),
        sortFunction: (a, b) => SortUtil.sortByDate(a.createdAt, b.createdAt),
      },
    ];
  };

  return isPageLoading ? null : (
    <div className="page-settings">
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
                isSelectable={PermissionUtil.check(
                  sessionAuth!,
                  SubscriberEndPointPermission.DELETE
                )}
                isAllSelectable={true}
                isSearchable={true}
                toggleMenuItems={getToggleMenuItems()}
                onClickToggleMenuItem={(selectedRows, value) =>
                  onChangeStatus(selectedRows, value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
