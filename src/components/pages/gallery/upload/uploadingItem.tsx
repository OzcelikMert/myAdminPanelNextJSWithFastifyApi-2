import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import Image from 'next/image';
import { IUploadingFile } from '@pages/gallery/upload';

type IComponentProps = {
  item: IUploadingFile;
  index: number;
};

const ComponentPageGalleryUploadUploadingItem = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    console.log("ComponentPageGalleryUploadUploadingItem", props);
    
    return (
      <div className="col-md-3 mt-1 mt-lg-2">
        <div className="row">
          <div className="col-4">
            <Image
              className="shadow-lg mb-1 img-fluid"
              src={URL.createObjectURL(props.item.file)}
              alt={props.item.file.name}
              width={75}
              height={75}
            />
          </div>
          <div className="col-8">
            <div className="row">
              <div className="col-md-12" title={props.item.file.name}>
                {props.item.file.name.length > 15
                  ? `${props.item.file.name.slice(0, 15)}...`
                  : props.item.file.name.length}
              </div>
              <div className="col-md-12 mt-2">
                {!props.item.isUploadable ? (
                  <b className="text-danger">{t('bigImageSize')}</b>
                ) : (
                  <div className="progress-lg progress">
                    <div
                      role="progressbar"
                      className="progress-bar bg-gradient-info"
                      style={{ width: `${props.item.progressValue}%` }}
                    >
                      {props.item.progressValue}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPageGalleryUploadUploadingItem;
