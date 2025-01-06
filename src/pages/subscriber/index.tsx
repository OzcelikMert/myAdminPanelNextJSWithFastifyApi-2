import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import ComponentToast from '@components/elements/toast';
import { ISubscriberGetResultService } from 'types/services/subscriber.service';
import { SubscriberService } from '@services/subscriber.service';
import ComponentDataTable from '@components/elements/table/dataTable';
import { getStatusIcon } from '@components/theme/badge/status';
import { status, StatusId } from '@constants/status';
import { PermissionUtil } from '@utils/permission.util';
import { SubscriberEndPointPermission } from '@constants/endPointPermissions/subscriber.endPoint.permission';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import { IComponentTableToggleMenuItem } from '@components/elements/table/toggleMenu';
import { SortUtil } from '@utils/sort.util';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { useDidMountHook } from '@library/react/customHooks';

type IComponentState = {
  items: ISubscriberGetResultService[];
  selectedItems: ISubscriberGetResultService[];
};

const initialState: IComponentState = {
  items: [],
  selectedItems: [],
};

export default function PageSubscribers() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [items, setItems] = useState<IComponentState['items']>(
    initialState.items
  );
  const [selectedItems, setSelectedItems] = useState<
    IComponentState['selectedItems']
  >(initialState.selectedItems);

  useDidMountHook(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  const init = async () => {
    if (
      PermissionUtil.checkAndRedirect({
        appDispatch,
        router,
        t,
        sessionAuth,
        minPermission: SubscriberEndPointPermission.GET,
      })
    ) {
      setPageTitle();
      await getItems();
      appDispatch(setIsPageLoadingState(false));
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
    const result = await SubscriberService.getMany({}, abortController.signal);

    if (result.status && result.data) {
      const items = result.data;
      setItems(items);
    }
  };

  const onChangeStatus = async (statusId: number) => {
    const selectedItemId = selectedItems.map((item) => item._id);

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

      const serviceResult = await SubscriberService.getMany(
        {
          _id: selectedItemId,
        },
        abortController.signal
      );

      loadingToast.hide();

      if (serviceResult.status) {
        let newItems = items.filter(
          (item) => !selectedItemId.includes(item._id)
        );
        setItems(newItems);
        new ComponentToast({
          type: 'success',
          title: t('successful'),
          content: t('itemDeleted'),
        });
      }
    }
  };

  const onSelect = (selectedRows: IComponentState['items']) => {
    setSelectedItems(selectedRows);
  };

  const getToggleMenuItems = (): IComponentTableToggleMenuItem[] => {
    return status.findMulti('id', [StatusId.Deleted]).map((item) => ({
      label: t(item.langKey),
      value: item.id,
      icon: getStatusIcon(item.id),
    }));
  };

  const getTableColumns = (): TableColumn<IComponentState['items'][0]>[] => {
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
                onSelect={(rows) => onSelect(rows)}
                isSelectable={PermissionUtil.check(
                  sessionAuth!,
                  SubscriberEndPointPermission.DELETE
                )}
                isAllSelectable={true}
                isSearchable={true}
                isActiveToggleMenu={true}
                toggleMenuItems={getToggleMenuItems()}
                onClickToggleMenuItem={(value) => onChangeStatus(value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
