import React from 'react';
import { IPageGalleryUploadState } from '@pages/gallery/upload';
import ComponentPageGalleryUploadUploadingItem from './uploadingItem';

type IComponentProps = {
  uploadingFiles: IPageGalleryUploadState['uploadingFiles'];
  maxFilesSize: number;
};

const ComponentPageGalleryUploadUploadings = React.memo(
  (props: IComponentProps) => {
    return (
      <div className="row mt-5 ms-1">
        {props.uploadingFiles.map((item, index) => (
          <ComponentPageGalleryUploadUploadingItem
            maxFileSize={props.maxFilesSize}
            item={item}
            index={index}
            key={`gallery_uploading_item_${index}`}
          />
        ))}
      </div>
    );
  }
);

export default ComponentPageGalleryUploadUploadings;
