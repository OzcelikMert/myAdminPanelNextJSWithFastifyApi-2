import React from 'react';
import ComponentThemeChooseImageGallery from './gallery';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';

type IComponentState = {
  isShowModal: boolean;
};

const initialState: IComponentState = {
  isShowModal: false,
};

export type IComponentThemeChooseImageProps = {
  isShow?: boolean;
  isMulti?: boolean;
  selectedImages?: string[];
  isShowReviewImage?: boolean;
  reviewImage?: string;
  reviewImageClassName?: string;
  reviewImageWidth?: number;
  reviewImageHeight?: number;
  showModalButtonText?: string | React.ReactNode;
  hideShowModalButton?: boolean;
  onChange?: (images: string[]) => void;
  onClickShowModal?: () => void;
  onHideModal?: () => void;
};

const ComponentThemeChooseImage = React.memo(React.forwardRef((props: IComponentThemeChooseImageProps, ref: any) => {
  const [isShowModal, setIsShowModal] = React.useState(
    initialState.isShowModal
  );
  const $html = document.querySelector('html');

  const onSelected = (images: string[]) => {
    if (props.onChange) {
      props.onChange(images);
    }
    onHide();
  };

  const onClickClear = () => {
    if (props.onChange) {
      props.onChange([]);
    }
  };

  const onHide = () => {
    setIsShowModal(false);
    if (props.onHideModal) {
      props.onHideModal();
    }
    if ($html) {
      $html.style.overflow = 'unset';
    }
  };

  const onClickShow = () => {
    setIsShowModal(true);
    if (props.onClickShowModal) {
      props.onClickShowModal();
    }
    if ($html) {
      $html.style.overflow = 'hidden';
    }
  };

  return (
    <div className="choose-images d-flex flex-row align-items-center">
      <ComponentThemeChooseImageGallery
        isShow={typeof props.isShow != 'undefined' ? props.isShow : isShowModal}
        onSubmit={(images) => onSelected(images)}
        onClose={() => onHide()}
      />
      {props.isShowReviewImage ? (
        <Image
          src={ImageSourceUtil.getUploadedImageSrc(props.reviewImage)}
          alt="Review Image"
          className={`review-img img-fluid ${props.reviewImageClassName}`}
          width={props.reviewImageWidth ?? 150}
          height={props.reviewImageHeight ?? 150}
        />
      ) : null}
      <div className="buttons">
        {!props.hideShowModalButton ? (
          <button
            type="button"
            className="btn btn-gradient-warning btn-xs ms-2"
            onClick={() => onClickShow()}
          >
            {props.showModalButtonText ? (
              <i>{props.showModalButtonText}</i>
            ) : (
              <i className="fa fa-pencil-square-o"></i>
            )}
          </button>
        ) : null}
        {props.selectedImages && props.selectedImages.length > 0 ? (
          <button
            type="button"
            className="btn btn-gradient-danger btn-xs ms-2"
            onClick={() => onClickClear()}
          >
            <i className="fa fa-remove"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
}));

export default ComponentThemeChooseImage;
