import React from 'react';
import { IPageGalleryUploadState } from '@pages/gallery/upload';
import ComponentPageGalleryUploadUploadingItem from './uploadingItem';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  uploadingFiles: IPageGalleryUploadState['uploadingFiles'];
  onClickClearAll: () => void;
};

const ComponentPageGalleryUploadUploadings = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row mt-3">
        <div className="col-md-2 mb-2">
          {props.uploadingFiles.length > 0 ? (
            <button
              className="btn btn-gradient-danger"
              onClick={() => props.onClickClearAll()}
            >
              {t('clear')} <i className="mdi mdi-broom"></i>
            </button>
          ) : null}
        </div>
        <div className="col-md-12">
          <div className="row">
            {props.uploadingFiles.map((item, index) => (
              <ComponentPageGalleryUploadUploadingItem
                item={item}
                index={index}
                key={`gallery_uploading_item_${item.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPageGalleryUploadUploadings;
