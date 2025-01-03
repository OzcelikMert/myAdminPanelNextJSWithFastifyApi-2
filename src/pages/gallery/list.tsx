import { useEffect, useReducer } from 'react';
import Swal from 'sweetalert2';
import { GalleryService } from '@services/gallery.service';
import { TableColumn } from 'react-data-table-component';
import ComponentToast from '@components/elements/toast';
import ComponentDataTable from '@components/elements/table/dataTable';
import Image from 'next/image';
import { GalleryTypeId } from '@constants/galleryTypeId';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IGalleryGetResultService } from 'types/services/gallery.service';
import ComponentTableUpdatedBy from '@components/elements/table/updatedBy';
import { SortUtil } from '@utils/sort.util';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import { selectTranslation } from '@lib/features/translationSlice';
import { setIsPageLoadingState } from '@lib/features/pageSlice';

type IComponentState = {
  items: IGalleryGetResultService[];
  selectedItems: IGalleryGetResultService[];
  isListLoading: boolean;
};

const initialState: IComponentState = {
  items: [],
  selectedItems: [],
  isListLoading: true,
};

type IAction = 
  | { type: 'SET_ITEMS'; payload: IComponentState['items'] }
  | { type: 'SET_SELECTED_ITEMS'; payload: IComponentState['selectedItems'] }
  | { type: 'SET_IS_LIST_LOADING'; payload: IComponentState['isListLoading'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      };
    case 'SET_SELECTED_ITEMS':
      return {
        ...state,
        selectedItems: action.payload,
      };
    case 'SET_IS_LIST_LOADING':
      return {
        ...state,
        isListLoading: action.payload,
      };
    default:
      return state;
  };
}

type IComponentProps = {
  isModal?: boolean;
  isMulti?: boolean;
  onSubmit?: (images: string[]) => void;
  uploadedImages?: IGalleryGetResultService[];
  selectedImages?: string[];
};

export default function PageGalleryList(props: IComponentProps) {
  let toast: null | ComponentToast = null;
  const abortController = new AbortController();

  const [state, dispatch] = useReducer(reducer, initialState);

  const appDispatch = useAppDispatch();
  const t = useAppSelector(selectTranslation);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
      toast?.hide();
    };
  }, []);

  useEffect(() => {
    if (props.uploadedImages) {
      dispatch({ type: 'SET_ITEMS', payload: state.items.concat(props.uploadedImages || []) });
    }
  }, [props.uploadedImages]);

  const init = async () => {
    await getItems();
    dispatch({ type: 'SET_IS_LIST_LOADING', payload: false });

    if (!props.isModal) {
      setPageTitle();
      appDispatch(setIsPageLoadingState(false));
    }
  }

  const setPageTitle = () => {
    appDispatch(setBreadCrumbState([
      {
        title: t('gallery'),
        url: EndPoints.GALLERY_WITH.LIST
      },
      {
        title: t('upload'),
        url: EndPoints.GALLERY_WITH.UPLOAD
      }
    ]));
  }

  const getItems = async () => {
    const serviceResult = await GalleryService.get(
      { typeId: GalleryTypeId.Image },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      dispatch({ type: 'SET_ITEMS', payload: serviceResult.data });
    }
  }

  const onSelect = (images: IGalleryGetResultService[]) => {
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: images });
    if (images.length > 0) {
      if (!toast || !toast.isShow) {
        toast = new ComponentToast({
          content: props.isModal ? (
            <button
              type="button"
              className="btn btn-gradient-success btn-icon-text w-100"
              onClick={() => onSubmit()}
            >
              <i className="mdi mdi-check btn-icon-prepend"></i>{' '}
              {t('okay')}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-gradient-danger btn-icon-text w-100"
              onClick={() => onDelete()}
            >
              <i className="mdi mdi-trash-can btn-icon-prepend"></i>{' '}
              {t('delete')}
            </button>
          ),
          borderColor: props.isModal ? 'success' : 'error',
          position: 'bottom-center',
        });
      }
    } else {
      toast?.hide();
    }
  }

  const onDelete = async () => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `${t('deleteSelectedItemsQuestion')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      toast?.hide();
      const loadingToast = new ComponentToast({
        title:t('loading'),
        content: t('deleting'),
        type: 'loading',
      });

      const serviceResult = await GalleryService.deleteMany(
        { _id: state.selectedItems.map((item) => item._id) },
        abortController.signal
      );
      loadingToast.hide();
      if (serviceResult.status) {
        dispatch({ type: 'SET_ITEMS', payload: state.items.filter((item) => !state.selectedItems.includes(item)) });
        dispatch({ type: 'SET_SELECTED_ITEMS', payload: [] });
        new ComponentToast({
          title: t('itemDeleted'),
          content: t('itemDeleted'),
          type: 'success',
          timeOut: 3,
        });
      }
    }
  }

  const onSubmit = () => {
    if (props.onSubmit) {
      const foundSelectedItems = state.items.findMulti(
        '_id',
        state.selectedItems
      );
      toast?.hide();
      props.onSubmit(
        foundSelectedItems.map((selectedItem) => selectedItem.name)
      );
    }
  }

  const getTableColumns = (): TableColumn<IComponentState['items'][0]>[] => {
    return [
      {
        name: t('image'),
        width: '105px',
        cell: (row) => (
          <div className="image pt-2 pb-2">
            <Image
              className="img-fluid"
              alt={row.name}
              src={ImageSourceUtil.getUploadedImageSrc(row.name)}
              width={100}
              height={100}
              loading={'lazy'}
            />
          </div>
        ),
      },
      {
        name: t('title'),
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: t('createdDate'),
        selector: (row) => new Date(row.createdAt).toLocaleDateString(),
        sortable: true,
        sortFunction: (a, b) => SortUtil.sortByDate(a.createdAt, b.createdAt),
        cell: (row) => (
          <ComponentTableUpdatedBy
            name={row.authorId.name}
            updatedAt={row.createdAt || ''}
          />
        ),
      },
      {
        name: t('size'),
        selector: (row) => `${row.sizeKB.toFixed(1)} KB`,
        sortable: true,
        sortFunction: (a, b) => {
          return a.sizeKB > b.sizeKB ? 1 : -1;
        },
      },
      {
        name: t('show'),
        width: '70px',
        button: true,
        cell: (row) => (
          <a
            className="btn btn-gradient-info btn-icon-text"
            href={ImageSourceUtil.getUploadedImageSrc(row.name)}
            target="_blank"
            rel="noreferrer"
          >
            <i className="mdi mdi-eye"></i>
          </a>
        ),
      },
    ];
  }

    return isPageLoading ? null : (
      <div className="page-gallery">
        <div className="grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <ComponentDataTable
                columns={getTableColumns()}
                data={state.items}
                onSelect={(rows) => onSelect(rows)}
                i18={{
                  search: t('search'),
                  noRecords: t('noRecords'),
                }}
                isSelectable={true}
                searchableKeys={['name']}
                isAllSelectable={!(props.isModal && !props.isMulti)}
                isMultiSelectable={!(props.isModal && !props.isMulti)}
                isSearchable={true}
                progressPending={state.isListLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  
}