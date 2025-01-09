import { RefObject, useEffect, useRef, useState } from 'react';
import { IUploadingFiles } from 'types/pages/gallery/upload';
import { GalleryService } from '@services/gallery.service';
import ComponentToast from '@components/elements/toast';
import Image from 'next/image';
import { IGalleryGetResultService } from 'types/services/gallery.service';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { EndPoints } from '@constants/endPoints';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IComponentState = {
  isDragging: boolean;
  uploadingFiles: IUploadingFiles[];
};

const initialState: IComponentState = {
  isDragging: false,
  uploadingFiles: [],
};

type IComponentProps = {
  isModal?: boolean;
  uploadedImages?: (images: IGalleryGetResultService[]) => void;
};

export default function PageGalleryUpload(props: IComponentProps) {
  const abortController = new AbortController();
  const inputFileRef: RefObject<HTMLInputElement | null> = useRef(null);
  const maxFileSize: number = Number(process.env.UPLOAD_FILE_SIZE ?? 1524000);

  const appDispatch = useAppDispatch();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [isDragging, setIsDragging] = useState(initialState.isDragging);
  const [uploadingFiles, setUploadingFiles] = useState(
    initialState.uploadingFiles
  );
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useDidMount(() => {
    init();

    return () => {
      abortController.abort();
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
        abortController.signal
      );

      if (serviceResult.status && serviceResult.data) {
        new ComponentToast({
          type: 'success',
          title: t('successful'),
          content: `${uploadingFile.file.name} ${t('imageUploadedWithName')}`,
          position: 'top-right',
          timeOut: 5,
        });
        if (props.uploadedImages) {
          props.uploadedImages(
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

  const updateUploadingFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      setIsDragging(false);
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

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    updateUploadingFiles(files);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    updateUploadingFiles(files);
  };

  const onClearUploadedImages = () => {
    setUploadingFiles((state) => {
      return state.filter(
        (uploadingFile) =>
          uploadingFile.progressValue < 100 && uploadingFile.status
      );
    });
  };

  const UploadingItem = (props: IUploadingFiles) => {
    return (
      <div className="col-md-3 mt-1 mt-lg-2">
        <div className="row">
          <div className="col-4">
            <Image
              className="shadow-lg mb-1 img-fluid"
              src={URL.createObjectURL(props.file)}
              alt={props.file.name}
              width={75}
              height={75}
            />
          </div>
          <div className="col-8">
            <div className="row">
              <div className="col-md-12" title={props.file.name}>
                {props.file.name.length > 15
                  ? `${props.file.name.slice(0, 15)}...`
                  : props.file.name.length}
              </div>
              <div className="col-md-12 mt-2">
                {props.file.size > maxFileSize ? (
                  <b className="text-danger">{t('bigImageSize')}</b>
                ) : (
                  <div className="progress-lg progress">
                    <div
                      role="progressbar"
                      className="progress-bar bg-gradient-info"
                      style={{ width: `${props.progressValue}%` }}
                    >
                      {props.progressValue}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return isPageLoading ? null : (
    <div className="page-gallery">
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div
              className="upload-container"
              onDragOver={(event) => onDragOver(event)}
              onDragLeave={(event) => onDragEnd(event)}
              onDrop={(event) => onDrop(event)}
            >
              <div
                className={`border-container text-center ${isDragging ? `bg-gradient-dark` : ``}`}
              >
                <input
                  type="file"
                  ref={inputFileRef}
                  hidden={true}
                  onChange={(event) => onChangeFile(event)}
                  multiple={true}
                  name="image[]"
                  accept=".jpg,.png,.gif,.jpeg"
                />
                <div className="icons">
                  <i className="mdi mdi-image"></i>
                  <i className="mdi mdi-file"></i>
                  <i className="mdi mdi-file-cloud"></i>
                </div>
                <p
                  className="cursor-pointer"
                  onClick={() => inputFileRef.current?.click()}
                >
                  {t('dragAndDropHere')} (.jpg, .png, .gif)
                </p>
              </div>
            </div>
            {uploadingFiles.length > 0 ? (
              <div className="row mt-5 ms-1">
                {uploadingFiles.map((file, index) => (
                  <UploadingItem {...file} key={index} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
