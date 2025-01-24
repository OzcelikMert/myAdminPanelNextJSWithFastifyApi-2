import React from 'react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import Image from 'next/image';
import ComponentFieldSet from '@components/elements/fieldSet';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

const GalleryItem = React.memo((props: { image: string }) => (
  <div className="col-md-3 mb-3">
    <Image
      src={ImageSourceUtil.getUploadedImageSrc(props.image)}
      alt="Empty Image"
      className="post-image img-fluid"
      width={100}
      height={100}
    />
  </div>
));

type IComponentState = {
  mainTabActiveKey: string;
};

const initialState: IComponentState = {
  mainTabActiveKey: 'general',
};

type IComponentProps = {
  imageBefore?: string;
  imageAfter?: string;
  images?: string[];
  onChangeImageBefore: (image: string) => void;
  onChangeImageAfter: (after: string) => void;
  onChangeImages: (images: string[]) => void;
};

const ComponentPagePostAddBeforeAndAfter = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-header text-center pt-3">
            <h4>{t('beforeAndAfter')}</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-7 mb-3">
                <ComponentFieldSet legend={t('imageBefore')}>
                  <ComponentThemeChooseImage
                    onSelected={(images) =>
                      props.onChangeImageBefore(images[0])
                    }
                    isMulti={false}
                    selectedImages={
                      props.imageBefore ? [props.imageBefore] : undefined
                    }
                    isShowReviewImage={true}
                    reviewImage={props.imageBefore}
                    reviewImageClassName={'post-image'}
                  />
                </ComponentFieldSet>
              </div>
              <div className="col-md-7 mb-3">
                <ComponentFieldSet legend={t('imageAfter')}>
                  <ComponentThemeChooseImage
                    onSelected={(images) => props.onChangeImageAfter(images[0])}
                    isMulti={false}
                    selectedImages={
                      props.imageAfter ? [props.imageAfter] : undefined
                    }
                    isShowReviewImage={true}
                    reviewImage={props.imageAfter}
                    reviewImageClassName={'post-image'}
                  />
                </ComponentFieldSet>
              </div>
              <div className="col-md-7 mb-3">
                <ComponentThemeChooseImage
                  onSelected={(images) => props.onChangeImages(images)}
                  isMulti
                  selectedImages={props.images}
                  showModalButtonText={t('gallery')}
                />
              </div>
              <div className="col-md-12 mb-3">
                <div className="row">
                  {props.images?.map((image) => <GalleryItem image={image} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddBeforeAndAfter;
