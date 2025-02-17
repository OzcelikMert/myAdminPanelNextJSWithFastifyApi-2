import React from 'react';
import ComponentThemeFormSelectImage from '@components/theme/form/inputs/selectImage';
import Image from 'next/image';
import ComponentFieldSet from '@components/elements/fieldSet';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeToolTipFormFieldErrors from '@components/theme/tooltip/formFieldErrors';

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
  images?: string[];
};

const ComponentPagePostAddBeforeAndAfter = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="grid-margin stretch-card">
        <div className="card">
          <div className="card-header text-center pt-3">
            <h4>
              {t('beforeAndAfter')}{' '}
              <ComponentThemeToolTipFormFieldErrors
                keys={['beforeAndAfter']}
                hideFieldTitles
              />
            </h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-7">
                <ComponentFieldSet legend={t('imageBefore')}>
                  <ComponentThemeFormSelectImage
                    title={t('imageBefore')}
                    name="beforeAndAfter.imageBefore"
                    reviewImageClassName={'post-image'}
                  />
                </ComponentFieldSet>
              </div>
              <div className="col-md-7">
                <ComponentFieldSet legend={t('imageAfter')}>
                  <ComponentThemeFormSelectImage
                    title={t('imageAfter')}
                    name="beforeAndAfter.imageAfter"
                    reviewImageClassName={'post-image'}
                  />
                </ComponentFieldSet>
              </div>
              <div className="col-md-7">
                <ComponentThemeFormSelectImage
                  title={t('gallery')}
                  name="beforeAndAfter.images"
                  isMulti
                  showModalButtonText={t('gallery')}
                  hideReviewImage
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
