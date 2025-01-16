import React, { useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

export type IComponentState = {
  isDragging: boolean;
};

const initialState: IComponentState = {
  isDragging: false,
};

type IComponentProps = {
  onSelectFiles: (files: FileList) => void;
};

const ComponentPageGalleryUploadContainer = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const [isDragging, setIsDragging] = useState(initialState.isDragging);
    const inputFileRef = useRef<HTMLInputElement>(null);

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
      if (files && files.length > 0) {
        if (isDragging) {
          setIsDragging(false);
        }
        props.onSelectFiles(files);
      }
    };

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        props.onSelectFiles(files);
      }
    };

    return (
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
    );
  }
);

export default ComponentPageGalleryUploadContainer;
