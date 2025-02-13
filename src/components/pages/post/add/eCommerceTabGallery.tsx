import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormSelectImage from '@components/theme/form/inputs/selectImage';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';

const Item = React.memo((imageProps: { item: string; index: number }) => {
  return (
    <div className="col-md-2 mb-3">
      <Image
        src={ImageSourceUtil.getUploadedImageSrc(imageProps.item)}
        alt={imageProps.item}
        className="post-image img-fluid"
        layout="responsive"
        objectFit="contain"
        width={100}
        height={100}
      />
    </div>
  );
});

type IComponentProps = {
  images?: string[];
  isECommerceVariation?: boolean;
  index?: number;
};

const ComponentPagePostAddECommerceTabGallery = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentThemeFormSelectImage
            name={
              props.isECommerceVariation
                ? `eCommerce.variations.${props.index}.product.eCommerce.images`
                : `eCommerce.images`
            }
            isMulti={true}
            showModalButtonText={t('selectImages')}
            hideReviewImage
            watch
          />
        </div>
        <div className="col-md-12 mb-3">
          <div className="row">
            {props.images?.map((item, index) => (
              <Item item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPagePostAddECommerceTabGallery;
