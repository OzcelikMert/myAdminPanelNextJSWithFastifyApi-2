import React, { useState } from 'react';
import { GalleryService } from '@services/gallery.service';
import { IGalleryGetResultService } from 'types/services/gallery.service';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { EndPoints } from '@constants/endPoints';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentPageGalleryUploadUploadings from '@components/pages/gallery/upload/uploadings';
import ComponentPageGalleryUploadContainer from '@components/pages/gallery/upload/container';
import { useToast } from '@hooks/toast';

export enum UploadingFileStatus {
  Pending,
  Uploading,
  Uploaded,
  Error,
}

export interface IUploadingFile {
  id: string;
  file: File;
  progressValue: number;
  isUploadable: boolean;
  status: UploadingFileStatus;
}

export type IPageGalleryUploadState = {
  uploadingFiles: IUploadingFile[];
};

const initialState: IPageGalleryUploadState = {
  uploadingFiles: [],
};

export type IPageGalleryUploadProps = {
  isModal?: boolean;
  onUploadImages?: (images: IGalleryGetResultService[]) => void;
};

export default function PageGalleryUpload(props: IPageGalleryUploadProps) {
  const abortControllerRef = React.useRef(new AbortController());

  const maxFileSize: number = Number(process.env.UPLOAD_FILE_SIZE ?? 1524000);

  const appDispatch = useAppDispatch();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const { showToast, hideToast } = useToast();

  const [uploadingFiles, setUploadingFiles] = useState(
    initialState.uploadingFiles
  );
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useDidMount(() => {
    init();

    return () => {
      abortControllerRef.current.abort();
    };
  });

  useEffectAfterDidMount(() => {
    if (isPageLoaded) {
      if (!props.isModal) {
        appDispatch(setIsPageLoadingState(false));
      }
    }
  }, [isPageLoaded]);

  useEffectAfterDidMount(() => {
    console.log(`useEffectAfterDidMount [uploadingFiles]`);
    for (const file of uploadingFiles) {
      console.log(`useEffectAfterDidMount [uploadingFiles] for`, file);
      if (file.status == UploadingFileStatus.Pending) {
        uploadFile(file);
      }
    }
  }, [uploadingFiles]);

  const init = () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    if (!props.isModal) {
      setPageTitle();
    }
    setIsPageLoaded(true);
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('gallery'),
          url: EndPoints.GALLERY_WITH.LIST,
        },
        {
          title: t('upload'),
        },
      ])
    );
  };

  const uploadFile = async (file: IUploadingFile) => {
    const loadingToast = showToast({
      type: 'loading',
      title: t('loading'),
      content: t('loadingWithVariable', [file.file.name]),
    });

    setUploadingFiles((stateFiles) =>
      stateFiles.map((stateFile) =>
        stateFile.id == file.id
          ? {
              ...stateFile,
              status: UploadingFileStatus.Uploading,
            }
          : stateFile
      )
    );

    const formData = new FormData();
    formData.append('image', file.file, file.file.name);

    const serviceResult = await GalleryService.add(
      formData,
      (e, percent) => {
        setUploadingFiles((stateFiles) =>
          stateFiles.map((stateFile) =>
            stateFile.id == file.id
              ? {
                  ...stateFile,
                  progressValue: percent ?? 100,
                }
              : stateFile
          )
        );
      },
      abortControllerRef.current.signal
    );

    setUploadingFiles((stateFiles) =>
      stateFiles.map((stateFile) =>
        stateFile.id == file.id
          ? {
              ...stateFile,
              status: serviceResult.status
                ? UploadingFileStatus.Uploaded
                : UploadingFileStatus.Error,
            }
          : stateFile
      )
    );

    hideToast(loadingToast);

    if (serviceResult.status && serviceResult.data) {
      showToast({
        type: 'success',
        title: t('successful'),
        content: t('imageUploadedWithName', [file.file.name]),
        position: 'top-right',
        timeOut: 5,
      });
      if (props.onUploadImages) {
        props.onUploadImages(
          serviceResult.data.map((image) => ({
            ...image,
            author: {
              _id: sessionAuth!.user.userId,
              name: sessionAuth!.user.name,
              image: sessionAuth!.user.image,
              url: sessionAuth!.user.url ?? '',
            },
          }))
        );
      }
    }
  };

  const onSelectFiles = (files: FileList) => {
    if (files && files.length > 0) {
      const newUploadingFiles: IUploadingFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const hasError = file.size > maxFileSize;
        newUploadingFiles.push({
          id: String.createId(),
          file: file,
          progressValue: hasError ? 100 : 0,
          isUploadable: !hasError,
          status: hasError
            ? UploadingFileStatus.Error
            : UploadingFileStatus.Pending,
        });
      }
      setUploadingFiles((state) => [...state, ...newUploadingFiles]);
    }
  };

  const onClearUploadedImages = () => {
    setUploadingFiles((state) => {
      return state.filter((uploadingFile) =>
        [UploadingFileStatus.Pending, UploadingFileStatus.Uploading].includes(
          uploadingFile.status
        )
      );
    });
  };

  return isPageLoading ? null : (
    <div className="page-gallery">
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <ComponentPageGalleryUploadContainer
              onSelectFiles={(files) => onSelectFiles(files)}
            />
            <ComponentPageGalleryUploadUploadings
              uploadingFiles={uploadingFiles}
              onClickClearAll={() => onClearUploadedImages()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
