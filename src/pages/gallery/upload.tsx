import React, { useState } from 'react';
import { IUploadingFiles } from 'types/pages/gallery/upload';
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

export type IPageGalleryUploadState = {
  uploadingFiles: IUploadingFiles[];
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

  const [uploadingFiles, setUploadingFiles] = useState(
    initialState.uploadingFiles
  );
  const { showToast } = useToast();
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

  const uploadFiles = async () => {
    for (const uploadingFile of uploadingFiles) {
      if (
        uploadingFile.progressValue === 100 ||
        uploadingFile.file.size > maxFileSize ||
        !uploadingFile.status
      )
        continue;

      const formData = new FormData();
      formData.append('image', uploadingFile.file, uploadingFile.file.name);

      const serviceResult = await GalleryService.add(
        formData,
        (e, percent) => {
          setUploadingFiles((state) => {
            const findIndex = state.findIndex(
              (uploadingFile) => uploadingFile.id === uploadingFile.id
            );
            if (findIndex > -1) {
              state[findIndex].progressValue = percent ?? 100;
            }
            return state;
          });
        },
        abortControllerRef.current.signal
      );

      if (serviceResult.status && serviceResult.data) {
        showToast({
          type: 'success',
          title: t('successful'),
          content: t('imageUploadedWithName', [uploadingFile.file.name]),
          position: 'top-right',
          timeOut: 5,
        });
        if (props.onUploadImages) {
          props.onUploadImages(
            serviceResult.data.map((image) => ({
              ...image,
              authorId: {
                _id: sessionAuth!.user.userId,
                name: sessionAuth!.user.name,
                image: sessionAuth!.user.image,
                url: sessionAuth!.user.url ?? '',
              },
            }))
          );
        }
      }
    }
  };

  const onSelectFiles = (files: FileList) => {
    if (files && files.length > 0) {
      setUploadingFiles((state) => {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          state.push({
            id: String.createId(),
            file: file,
            progressValue: file.size < maxFileSize ? 0 : 100,
            status: file.size < maxFileSize,
          });
        }
        return state;
      });
      uploadFiles();
    }
  };

  const onClearUploadedImages = () => {
    setUploadingFiles((state) => {
      return state.filter(
        (uploadingFile) =>
          uploadingFile.progressValue < 100 && uploadingFile.status
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
              maxFilesSize={maxFileSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
